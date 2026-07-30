export function LegalFooter() {
  return (
    <footer className="bg-brand-navy px-4 py-10 text-brand-navy-foreground">
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <a href="/termos" className="underline underline-offset-4">
            Termos de Uso
          </a>
          <a href="/privacidade" className="underline underline-offset-4">
            Políticas de Privacidade
          </a>
        </div>
        <p className="mt-5 text-sm font-medium">GRIDE HOLDING, LLC — EIN 35-2691778</p>
        <p className="text-sm font-medium">
          7345 W Sand Lake Rd, Ste 210, Office 700, Orlando, FL 32819, USA
        </p>
        <p className="mt-5 text-xs leading-relaxed opacity-90">
          GRIDE HOLDING, LLC oferece conteúdo informativo gratuito sobre cartões de crédito, bancos
          digitais, empréstimos e serviços financeiros de terceiros. Não somos uma instituição
          financeira, não mantemos necessariamente afiliações diretas e nunca cobramos taxas pelo
          acesso à nossa plataforma. Todas as recomendações são estritamente informativas e não
          constituem aconselhamento financeiro; consulte profissionais qualificados. As condições
          dos empréstimos são determinadas exclusivamente pela instituição credora. O período mínimo
          de quitação é de 12 meses e o máximo de 60 meses. A GRIDE HOLDING, LLC não oferece ou
          promove empréstimos de curto prazo com prazos de pagamento de 60 dias ou menos. Exemplo
          representativo: Um empréstimo de R$ 10.000 por 36 meses com uma Taxa de Juros Anual
          (CET/APR) de 3% resulta em um custo total de quitação de R$ 10.470. As taxas de juros
          anuais variam de 3% a 22%. Podemos receber compensação ou comissões de parceiros
          afiliados. Cumprimos com as regulamentações da LGPD; você mantém o direito de acessar ou
          solicitar a exclusão de seus dados pessoais. As transmissões de dados empregam medidas de
          proteção rigorosas padrão do setor. Leia nossa Política de Privacidade. Operado por: Gride
          Holding, LLC.
        </p>
      </div>
    </footer>
  );
}
