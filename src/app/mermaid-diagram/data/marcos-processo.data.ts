import { formatarMarcosProcesso } from "../utils/formatador-marcos-processo";

// 🔹 Todos os dados originais do processo (sem `key` e `next`)
const DADOS_ORIGINAIS = [
  {
    data: "2022-12-21",
    type: "Envio de petição",
    title: "Propositura da Ação",
    unidade: "Representante Legal (Advogado)",
    instance: "1ª Grau",
    descricao: "Francisca das Chagas Santos propôs Ação de Indenização contra Banco Bradesco Financiamento S.A.",
    tipo_ato: "ato_polo_ativo",
  },
  {
    data: "2023-01-04",
    type: "Decisão e Certificação",
    title: "Decisão Inicial e Certificação de Triagem",
    unidade: "Vara Única da Comarca de Capitão de Campos",
    instance: "1ª Grau",
    descricao: "Juiz defere pedido de Justiça Gratuita e determina a citação do réu para contestar no prazo de 15 dias, com inversão do ônus da prova.",
    tipo_ato: "decisão",
  },
  {
    data: "2023-01-11",
    type: "Citação",
    title: "Citação do Réu",
    unidade: "Vara Única da Comarca de Capitão de Campos",
    instance: "1ª Grau",
    descricao: "Citação do Banco Bradesco para contestar no prazo de 15 dias.",
    tipo_ato: "ato_polo_passivo",
  },
  {
    data: "2023-02-10",
    type: "Envio de petição",
    title: "Contestação",
    unidade: "Representante Legal (Advogado)",
    instance: "1ª Grau",
    descricao: "Banco Bradesco apresenta contestação, alegando regularidade da contratação e ausência de vício de vontade.",
    tipo_ato: "ato_polo_passivo",
  },
  {
    data: "2023-04-13",
    type: "Intimação",
    title: "Intimação para Réplica",
    unidade: "Vara Única da Comarca de Capitão de Campos",
    instance: "1ª Grau",
    descricao: "Intimação da parte autora para apresentar réplica no prazo de 15 dias.",
    tipo_ato: "ato_tribunal",
  },
  {
    data: "2023-04-17",
    type: "Certificação",
    title: "Certificação de Tempestividade",
    unidade: "Vara Única da Comarca de Capitão de Campos",
    instance: "1ª Grau",
    descricao: "Certificação da tempestividade da contestação apresentada pelo réu.",
    tipo_ato: "ato_tribunal",
  },
  {
    data: "2023-07-24",
    type: "Envio de petição",
    title: "Réplica à Contestação",
    unidade: "Representante Legal (Advogado)",
    instance: "1ª Grau",
    descricao: "A parte autora apresenta réplica à contestação, argumentando contra a validade do contrato baseado em biometria facial e solicitando a compensação de valores.",
    tipo_ato: "ato_polo_ativo",
  },
  // {
  //   data: "2023-08-17",
  //   type: "Certificação",
  //   title: "Certificação de Conclusão para Despacho",
  //   unidade: "Vara Única da Comarca de Capitão de Campos",
  //   instance: "1ª Grau",
  //   descricao: "Certifico que, nesta data, faço a conclusão do presente processo para Despacho.",
  //   tipo_ato: "ato_tribunal",
  // },
  // {
  //   data: "2023-09-01",
  //   type: "Decisão",
  //   title: "Decisão de Inversão do Ônus da Prova",
  //   unidade: "Vara Única da Comarca de Capitão de Campos",
  //   instance: "1ª Grau",
  //   descricao: "Inverto o ônus da prova e determino que a parte requerida junte o contrato firmado com a parte autora, bem como TED/Ordem de Pagamento.",
  //   tipo_ato: "decisão",
  // },
  // {
  //   data: "2023-09-08",
  //   type: "Envio de petição",
  //   title: "Concordância ao Julgamento Antecipado",
  //   unidade: "Representante Legal (Advogado)",
  //   instance: "1ª Grau",
  //   descricao: "Banco Bradesco informa que não possui mais provas a produzir e manifesta concordância ao julgamento antecipado da lide.",
  //   tipo_ato: "ato_polo_passivo",
  // },
  // {
  //   data: "2023-12-20",
  //   type: "Envio de petição",
  //   title: "Juntada de Documentos",
  //   unidade: "Representante Legal (Advogado)",
  //   instance: "1ª Grau",
  //   descricao: "Banco Bradesco junta documentos necessários para comprovação dos fatos e fundamentos articulados na peça de defesa.",
  //   tipo_ato: "ato_polo_passivo",
  // },
  // {
  //   data: "2024-02-08",
  //   type: "Decisão",
  //   title: "Sentença",
  //   unidade: "Vara Única da Comarca de Capitão de Campos",
  //   instance: "1ª Grau",
  //   descricao: "Declara a inexistência do contrato discutido, condena o réu a pagar danos morais e a devolver os valores descontados do benefício previdenciário da parte autora, de forma dobrada.",
  //   tipo_ato: "decisão",
  // },
  // {
  //   data: "2024-06-18",
  //   type: "Decisão",
  //   title: "Decisão Monocrática",
  //   unidade: "Gabinete do Desembargador José Wilson Ferreira de Araújo Júnior",
  //   instance: "2ª Grau",
  //   descricao: "Recebimento do recurso de Apelação Cível no duplo efeito, nos termos do art. 1.012, caput e art. 1.013, ambos do CPC/15.",
  //   tipo_ato: "decisão",
  // },
  // {
  //   data: "2024-10-15",
  //   type: "Decisão",
  //   title: "Decisão Terminativa",
  //   unidade: "Gabinete do Desembargador José Wilson Ferreira de Araújo Júnior",
  //   instance: "2ª Grau",
  //   descricao: "Reforma da sentença do juízo singular para julgar improcedentes os pedidos da inicial, com fulcro no art. 487, I, do CPC.",
  //   tipo_ato: "decisão",
  // },
  // {
  //   data: "2024-11-22",
  //   type: "Certificação",
  //   title: "Certidão de Trânsito em Julgado",
  //   unidade: "Coordenadoria Judiciária Cível e Câmaras Reunidas",
  //   instance: "2ª Grau",
  //   descricao: "Certificação de que a decisão transitou em julgado no dia 22 de Novembro de 2024.",
  //   tipo_ato: "ato_tribunal",
  // },
];

export const MARCOS_PROCESSO = formatarMarcosProcesso(DADOS_ORIGINAIS);
