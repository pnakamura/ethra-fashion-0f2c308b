import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Eu gastava horas toda manhã pensando no que vestir. Agora em 2 minutos já tenho um look montado que combina com meu tom de pele.",
    author: "Carolina M.",
    role: "Plano Trendsetter",
    rating: 5,
  },
  {
    quote: "A colorimetria mudou completamente minhas compras. Parei de comprar peças que ficavam 'estranhas' e agora tudo combina.",
    author: "Fernanda R.",
    role: "Plano Icon",
    rating: 5,
  },
  {
    quote: "O provador virtual me salvou de pelo menos 3 compras erradas esse mês. Já pagou a assinatura com folga.",
    author: "Juliana S.",
    role: "Plano Trendsetter",
    rating: 5,
  },
  {
    quote: "Comecei no plano grátis, fiz o trial de 7 dias e nunca mais larguei. As malas de viagem inteligentes são geniais.",
    author: "Mariana L.",
    role: "Plano Icon",
    rating: 5,
  },
  {
    quote: "Meu closet era uma bagunça total. Em uma semana organizei tudo digitalmente e descobri combinações que nunca imaginei.",
    author: "Beatriz A.",
    role: "Plano Trendsetter",
    rating: 5,
  },
  {
    quote: "Sempre tive medo de ousar no estilo. O Ethra me mostrou que posso ser criativa e ainda assim parecer profissional.",
    author: "Patricia K.",
    role: "Plano Muse",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function TestimonialsCarousel() {
  return (
    <section className="py-24 px-6 bg-secondary/30 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4">
            Quem usa,
            <br />
            <span className="text-gradient">recomenda</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Veja o que nossas usuárias dizem sobre a experiência com o Ethra
          </p>
        </motion.div>

        {/* Infinite scroll carousel */}
        <div className="relative">
          <motion.div
            className="flex gap-6"
            animate={{ x: [0, -1400] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 md:w-96 p-8 rounded-3xl bg-card border border-border/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <Quote className="w-7 h-7 text-primary/30" />
                  <StarRating count={testimonial.rating} />
                </div>
                <p className="text-base leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="text-sm font-medium">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Gradient overlays */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-secondary/30 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-secondary/30 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
