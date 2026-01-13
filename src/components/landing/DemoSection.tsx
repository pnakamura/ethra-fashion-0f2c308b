import { motion } from 'framer-motion';
import { Sparkles, Camera, ShoppingBag, Palette } from 'lucide-react';
import { ChromaticDemo } from './ChromaticDemo';
import { VirtualTryOnDemo } from './VirtualTryOnDemo';

export function DemoSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Chromatic Demo Section */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Palette className="w-4 h-4" />
              Experimente grátis
            </motion.div>
            
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4">
              Qual é a sua
              <br />
              <span className="text-gradient">paleta perfeita?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nossa IA analisa seu tom de pele e olhos para revelar as cores que mais te valorizam
            </p>
          </div>

          <ChromaticDemo />
        </motion.div>

        {/* Virtual Try-On Demo */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4">
            Veja a mágica
            <br />
            <span className="text-gradient">acontecer</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experimente roupas virtualmente antes de comprar
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-card border border-border flex items-center justify-center">
                <Camera className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Tire uma foto</h3>
            <p className="text-muted-foreground text-sm">
              Fotografe-se ou use uma foto existente como seu avatar virtual
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute inset-4 rounded-full bg-card border border-border flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Escolha a roupa</h3>
            <p className="text-muted-foreground text-sm">
              Do seu closet, de uma loja online ou capture de qualquer site
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute inset-4 rounded-full bg-card border border-border flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Veja em você</h3>
            <p className="text-muted-foreground text-sm">
              Nossa IA cria uma imagem realista de como a roupa fica em você
            </p>
          </motion.div>
        </div>

        {/* Virtual Try-On Demo */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <VirtualTryOnDemo />
        </motion.div>
      </div>
    </section>
  );
}