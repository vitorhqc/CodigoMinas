import { cp } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import firebird from "node-firebird"
import { setTimeout } from "timers/promises";

var dboptions : firebird.Options;

dboptions = {

    host : process.env.host,
    port : Number(process.env.fbport),
    database : process.env.databaseKingHost,
    user : process.env.user,
    password : process.env.password,
    lowercase_keys : (process.env.lowercase_keys == 'true'),
    role : process.env.role,
    pageSize : Number(process.env.pageSize),
    retryConnectionInterval: Number(process.env.retryConnectionInterval),
    blobAsText : (process.env.blobAsText == 'true'),
    encoding : process.env.encoding as firebird.SupportedCharacterSet,

};

export async function GET(req: NextRequest) {
        const {searchParams} = new URL(req.url);
        const sigla = searchParams.get('sigla') ?? '';
        const cpfcnpj = searchParams.get('cpfcnpj') ?? '';
        const params: [string, string] = [sigla, cpfcnpj];
        const dataExp = getFutureBusinessDate();
        const db = await getConnection();
        const cliente = await QueryClienteCodigo(db, params);
        const siglaCliente = cliente[0]['sigla'];
        if (cliente[0]['diasatraso'] > 0){
          return NextResponse.json('Cliente em atraso!');
        }
        const CodProt = gerarCodProt(siglaCliente, dataExp);
        return NextResponse.json(CodProt);
}

function getConnection(): Promise<firebird.Database> {
    return new Promise((resolve, reject) => {
      firebird.attach(dboptions, (err, db) => {
        if (err) return reject(err);
        resolve(db);
      });
    });
  }

function QueryClientes(db: firebird.Database, [sigla = '', cpfcnpj = '']): Promise<any> {
    return new Promise((resolve, reject) => {
      let sql = '';
      let params: string[] = [];
      if (sigla != '' && cpfcnpj != '') {
        sigla = `%${sigla}%`;
        cpfcnpj = `%${cpfcnpj}%`;
        sql = 'SELECT * FROM CLF_CLIENTES WHERE SIGLA LIKE ? AND (CPF LIKE ? or CNPJ LIKE ?)';
        params = [sigla, cpfcnpj, cpfcnpj];
      }
      else if (sigla != '' && cpfcnpj == '') {
        sigla = `%${sigla}%`;
        sql = 'SELECT * FROM CLF_CLIENTES WHERE SIGLA LIKE ?';
        params = [sigla];
      }
      else {
        return reject('Sigla ou CPF/CNPJ sao necessários!');
      }
      db.query(sql, params, (err, result) => {
        db.detach(); // Always detach

        if (err) return reject(err);
        resolve(result);
      });
    });
}

function QueryClienteCodigo(db: firebird.Database, [sigla = '', cpfcnpj = '']): Promise<any> {
  return new Promise((resolve, reject) => {
    let sql = '';
    let params: string[] = [];
    if (sigla != '' && cpfcnpj != '') {
      sigla = `%${sigla}%`;
      cpfcnpj = `%${cpfcnpj}%`;
      sql = 'SELECT * FROM CLF_CLIENTES WHERE SIGLA LIKE ? AND (CPF LIKE ? or CNPJ LIKE ?)';
      params = [sigla, cpfcnpj, cpfcnpj];
    }
    else {
      return reject('Sigla e CPF/CNPJ sao necessários!');
    }
    db.query(sql, params, (err, result) => {
      db.detach(); // Always detach

      if (err) return reject(err);
      resolve(result);
    });
  });
}

function gerarCodProt(sigla: string, dataExp: Date): string {
  const msigla = sigla;
  const vsigla = msigla.charCodeAt(0) + msigla.charCodeAt(1) + msigla.charCodeAt(2) - 192;

  const day = dataExp.getDate().toString().padStart(2, '0');
  const month = (dataExp.getMonth() + 1).toString().padStart(2, '0');
  const year = dataExp.getFullYear().toString().slice(-2);
  const expira = `${day}/${month}/${year}`;

  const xdt =
    (parseInt(month) + vsigla + 2).toString().padStart(2, '0') +
    (parseInt(year) + vsigla).toString().padStart(2, '0') +
    (parseInt(day) + vsigla + 1).toString().padStart(2, '0');

  let letras = "ACEGIKMOQSUXZBDFHJLNPRTVYWAVCEGIKMOQSUXZBDFHJLNPRTVYWAJCEGIKMOQSUXZBDFHJLNPRTVYWATCEGIKMOQSUXZBDFHJLNPRTVYWA";
  letras += letras;

  const hoje = new Date();
  const soma_extra = hoje.getDate() + (hoje.getMonth() + 1) + (hoje.getFullYear() % 100);

  const xdtInt = parseInt(xdt);
  let mse = (xdtInt * (77 + soma_extra)).toString().padStart(8, '0');

  const somatorioData = parseInt(year) + parseInt(month) + parseInt(day);

  mse =
    mse.substring(0, 3) +
    letras.charAt(msigla.charCodeAt(0) + somatorioData - 1) +
    mse.substring(3, 6) +
    letras.charAt(msigla.charCodeAt(1) + somatorioData - 1) +
    mse.substring(6, 8) +
    letras.charAt(msigla.charCodeAt(2) + somatorioData - 1);

  const cse = mse.substring(0, 3) + mse.substring(4, 7) + mse.substring(8, 10);

  const cseInt = parseInt(cse);
  const xcal = Math.floor(cseInt / (77 + soma_extra)).toString().padStart(6, '0');

  const zcal = parseInt(xcal.substring(0, 2));

  const finalKey =
    (parseInt(xcal.substring(4, 6)) - 1 - vsigla).toString().padStart(2, '0') +
    (zcal - 2 - vsigla).toString().padStart(2, '0') +
    (parseInt(xcal.substring(2, 4)) - vsigla).toString().padStart(2, '0');

  return mse;
}

function getFutureBusinessDate(): Date {
  const today = new Date();
  const future = new Date(today);

  // Adiciona um mês
  future.setMonth(future.getMonth() + 1);

  // Corrige se o novo mês "pular" para dois meses à frente (ex: 31 jan + 1 mês = 3 mar)
  while (future.getMonth() !== (today.getMonth() + 1) % 12) {
      future.setDate(future.getDate() - 1);
  }

  // Se cair no sábado (6), avança para segunda (8)
  if (future.getDay() === 6) {
      future.setDate(future.getDate() + 2);
  }

  // Se cair no domingo (0), avança para segunda (1)
  else if (future.getDay() === 0) {
      future.setDate(future.getDate() + 1);
  }

  return future;
}