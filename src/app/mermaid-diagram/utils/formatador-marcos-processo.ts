export function formatarMarcosProcesso(marcos: any[]): any[] {
  return marcos.map((marco, index) => {
    // Remove o atributo 'index' do objeto antes de retornar
    const { index: _, ...dadosSemIndex } = marco;

    const formatted = {
      ...dadosSemIndex, // Mantém os outros dados originais
      key: (index + 1).toString(), // Define `key` com base no índice
    };

    // Define o `next` corretamente, removendo `null`
    if (index < marcos.length - 1) {
      formatted["next"] = (index + 2).toString();
    }

    return formatted;
  });
}
