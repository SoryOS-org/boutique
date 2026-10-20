import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
if (!process.env.GEMINI_API_KEY) {
  dotenv.config({ path: '.env.example' });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve static images across all route aliases with caching for fast mobile loading
app.use('/images', express.static(path.resolve(__dirname, 'public/images'), { maxAge: '7d' }));
app.use('/assets/images', express.static(path.resolve(__dirname, 'public/assets/images'), { maxAge: '7d' }));
app.use('/src/assets/images', express.static(path.resolve(__dirname, 'public/assets/images'), { maxAge: '7d' }));
app.use(express.static(path.resolve(__dirname, 'public'), { maxAge: '7d' }));

const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, catalogContext, pageContext } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message requis' });
    }

    const ai = getGenAIClient();

    // Catalog summary string for the model
    let catalogSummary = '';
    if (Array.isArray(catalogContext) && catalogContext.length > 0) {
      catalogSummary = catalogContext
        .map(
          (p: any) =>
            `- ID: "${p.id}" | Nom: "${p.name}" | Rayon: "${p.categoryLabel || p.category}" | Prix: ${p.priceEUR}€ (au lieu de ${p.originalPriceEUR}€) | Stock: ${p.stockQuantity ?? 'disponible'} | Choice: ${p.isChoice ? 'Oui' : 'Non'} | Description: ${p.description || ''}`
        )
        .join('\n');
    }

    const activeCat = pageContext?.selectedCategory || 'all';
    const cartCount = pageContext?.cartCount ?? 0;

    const systemPrompt = `Vous êtes SoryBot, l'assistant d'achat officiel, concierge et expert e-commerce de "SoryOS boutique en ligne".
Votre rôle est d'être un VRAI assistant expert :
1. Lire et analyser attentivement la page actuelle et le catalogue de la boutique.
2. Expliquer très bien et en détail les articles demandés par le client (matières nobles comme le coton égyptien ou la soie, fabrication artisanale, technologies de réduction de bruit, finitions, usage au quotidien, rapport qualité/prix direct usine).
3. Sélectionner les identifiants de produits EXACTS correspondant à la demande du client pour afficher leurs cartes interactives ("cards") dans le chat.
4. Souligner les avantages SoryOS Choice (expédition 24h, livraison offerte dès 20€ d'achat, retour gratuit sous 15j, garantie 90j) et les alertes de stock limité (si stock < 5 unités).

Voici le catalogue actuellement disponible dans la boutique :
${catalogSummary || `
- ID: "aly-towel-set" | Nom: "Set de Serviettes Égyptiennes Douceur Spa" | Rayon: "Maison & Textile" | Prix: 24.99€ | Stock: 3
- ID: "aly-silk-caftan" | Nom: "Caftan en Soie Brodé Élégance Traditionnelle" | Rayon: "Mode & Artisanat" | Prix: 89.90€ | Stock: 2
- ID: "aly-curtains-linen" | Nom: "Rideaux Occultants en Lin Premium" | Rayon: "Maison & Textile" | Prix: 39.50€ | Stock: 4
- ID: "aly-duvet-set" | Nom: "Parure de Lit en Coton Satiné" | Rayon: "Maison & Textile" | Prix: 45.00€ | Stock: 4
- ID: "aly-curtain-rod" | Nom: "Barre de Rideau Industrielle Mate" | Rayon: "Quincaillerie & Maison" | Prix: 18.90€ | Stock: 15
- ID: "aly-anc-900" | Nom: "Casque Audio Aurum Studio ANC Titane 45dB" | Rayon: "Audio & Casques" | Prix: 49.99€ | Stock: 18
- ID: "aly-acoustic-cyl" | Nom: "Enceinte Portable 360° Stone & Fabric 30W IPX7" | Rayon: "Audio & Casques" | Prix: 34.90€ | Stock: 8
- ID: "aly-chronos-ultra" | Nom: "Montre Connectée Chronos Ultra Titane Sapphire AMOLED" | Rayon: "Montres & Wearables" | Prix: 59.00€ | Stock: 12
- ID: "aly-drone-4k" | Nom: "Drone Pliable Aerox Pro 4K Cardan 3 Axes GPS" | Rayon: "Drones & Caméras" | Prix: 129.00€ | Stock: 6
- ID: "aly-mech-lumina" | Nom: "Clavier Mécanique Sans Fil Lumina 65% Hot-Swap Gasket" | Rayon: "PC & Claviers" | Prix: 54.00€ | Stock: 14
- ID: "aly-espresso-pro" | Nom: "Moulin à Café Électrique Fellow Precision Meules Coniques" | Rayon: "Maison & Barista" | Prix: 42.00€ | Stock: 9
- ID: "aly-backpack-commuter" | Nom: "Sac à Dos Urbain Étanche Nomad Commuter 25L Antivol" | Rayon: "Bagagerie & Lifestyle" | Prix: 32.50€ | Stock: 7
- ID: "aly-skincare-aura" | Nom: "Coffret Rituel Botanique Aura Sérum Éclat & Crème Régénérante" | Rayon: "Beauté & Soin" | Prix: 28.00€ | Stock: 3
`}

Contexte de la page :
- Catégorie active sur la boutique : ${activeCat}
- Nombre d'articles dans le panier de l'utilisateur : ${cartCount}

INSTRUCTIONS DE RÉPONSE OBLIGATOIRES :
Vous devez répondre UNIQUEMENT sous la forme d'un objet JSON strict avec cette structure :
{
  "explanation": "Explication complète, chaleureuse et experte en français, mettant en valeur les détails du produit, son utilité et pourquoi il est recommandé...",
  "productIds": ["id_du_produit_1", "id_du_produit_2"],
  "suggestedQuestions": ["Question suggérée 1", "Question suggérée 2"]
}

Règles :
- Si l'utilisateur demande des produits spécifiques (ex: serviettes, caftans, rideaux, couettes, barres, audio, montre, café, etc.), incluez toujours les IDs de ces produits dans "productIds".
- S'il demande des recommandations générales ou des articles à petit prix, proposez les plus pertinents.
- Si la question concerne uniquement la logistique, les retours ou les coupons ("ALY10", "BIENVENUE5", "CHOICEDAY"), expliquez clairement et vous pouvez laisser "productIds" vide ou suggérer un article coup de cœur.`;

    if (ai) {
      const contents: any[] = [];
      if (Array.isArray(history)) {
        for (const h of history.slice(-6)) {
          if (h && h.text && (h.sender === 'user' || h.sender === 'bot')) {
            contents.push({
              role: h.sender === 'user' ? 'user' : 'model',
              parts: [{ text: h.text }],
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text?.trim() || '';
      try {
        const parsed = JSON.parse(rawText);
        return res.json({
          reply: parsed.explanation || "Voici les articles recommandés pour votre recherche :",
          productIds: Array.isArray(parsed.productIds) ? parsed.productIds : [],
          suggestedQuestions: Array.isArray(parsed.suggestedQuestions) ? parsed.suggestedQuestions : [],
        });
      } catch (jsonErr) {
        // Fallback if not pure JSON
        return res.json({
          reply: rawText || "Je suis à votre disposition pour vous conseiller sur nos articles !",
          productIds: [],
          suggestedQuestions: [],
        });
      }
    }

    // Intelligent local fallback if Gemini key is absent
    const lower = message.toLowerCase();
    const matchedIds: string[] = [];
    let explanation = '';

    if (lower.includes('serviette') || lower.includes('bain') || lower.includes('spa')) {
      matchedIds.push('aly-towel-set');
      explanation = "Notre **Set de Serviettes Égyptiennes Douceur Spa** (24,99 €) est confectionné en pur coton peigné 650g/m². Il offre une absorption exceptionnelle et un toucher moelleux digne des plus grands hôtels. Attention, il ne reste que 3 unités en stock !";
    } else if (lower.includes('caftan') || lower.includes('robe') || lower.includes('mariage') || lower.includes('soie')) {
      matchedIds.push('aly-silk-caftan');
      explanation = "Le **Caftan en Soie Brodé Élégance Traditionnelle** (89,90 €) est une pièce de haute couture artisanale. Brodé de fils de soie et orné de passementerie délicate, il offre une coupe noble parfaite pour les grandes occasions. Pièce rare : plus que 2 exemplaires disponibles.";
    } else if (lower.includes('rideau') || lower.includes('barre') || lower.includes('tringle') || lower.includes('occultant')) {
      matchedIds.push('aly-curtains-linen', 'aly-curtain-rod');
      explanation = "Pour habiller vos fenêtres, nous vous conseillons les **Rideaux Occultants en Lin Premium** (39,50 €) associés à la **Barre de Rideau Industrielle Mate** (18,90 €). Le lin apporte une texture naturelle élégante tout en bloquant 95% de la lumière extérieure.";
    } else if (lower.includes('lit') || lower.includes('couette') || lower.includes('drap') || lower.includes('chambre')) {
      matchedIds.push('aly-duvet-set', 'aly-towel-set');
      explanation = "Pour votre chambre, la **Parure de Lit en Coton Satiné** (45,00 €) offre la douceur fraîche du satin de coton 400 fils avec housse de couette et taies coordonnées. Hypoallergénique et thermorégulatrice pour un sommeil réparateur.";
    } else if (lower.includes('casque') || lower.includes('audio') || lower.includes('ecouteur') || lower.includes('son') || lower.includes('musique')) {
      matchedIds.push('aly-anc-900', 'aly-acoustic-cyl');
      explanation = "En audio haute-fidélité, découvrez le **Casque Aurum Studio ANC Titane** (49,99 €) avec réduction active de bruit 45dB et 60h d'autonomie, ou l'**Enceinte 360° Stone & Fabric IPX7** (34,90 €) pour un son puissant omnidirectionnel.";
    } else if (lower.includes('drone') || lower.includes('camera') || lower.includes('video')) {
      matchedIds.push('aly-drone-4k');
      explanation = "Le **Drone Aerox Pro 4K** (129,00 €) embarque une nacelle stabilisée 3 axes, un capteur Sony 4K HDR, un GPS double fréquence et 32 minutes d'autonomie par vol. Idéal pour des prises de vue aériennes cinématiques.";
    } else if (lower.includes('montre') || lower.includes('connectee') || lower.includes('smartwatch')) {
      matchedIds.push('aly-chronos-ultra');
      explanation = "La **Montre Chronos Ultra Titane Sapphire** (59,00 €) combine un boîtier titane de grade aérospatial, un écran AMOLED ultra-lumineux et le suivi santé complet (ECG, SpO2, sommeil et 100+ modes sport).";
    } else if (lower.includes('cafe') || lower.includes('barista') || lower.includes('moulin')) {
      matchedIds.push('aly-espresso-pro');
      explanation = "Le **Moulin à Café Fellow Precision** (42,00 €) avec meules coniques en acier inoxydable garantit une mouture homogène sans surchauffe des grains, parfait pour espresso, V60 et french press.";
    } else if (lower.includes('stock') || lower.includes('urgence') || lower.includes('limité') || lower.includes('rare')) {
      matchedIds.push('aly-silk-caftan', 'aly-towel-set', 'aly-skincare-aura');
      explanation = "Voici nos articles actuellement en **Stock limité (< 5 unités)** disponibles immédiatement à prix direct usine. Ces pièces partent très vite, profitez-en avant rupture de stock !";
    } else if (lower.includes('20') || lower.includes('pas cher') || lower.includes('petit prix') || lower.includes('promo')) {
      matchedIds.push('aly-curtain-rod', 'aly-towel-set', 'aly-skincare-aura');
      explanation = "Voici nos meilleures sélections à prix très avantageux, certifiées direct usine avec livraison offerte dès 20 € d'achat Choice !";
    } else {
      matchedIds.push('aly-towel-set', 'aly-silk-caftan', 'aly-anc-900');
      explanation = `Bonjour ! Je suis SoryBot, votre assistant personnel SoryOS. J'ai bien analysé votre demande. Voici les articles emblématiques de notre catalogue avec livraison Choice prioritaire et garanties direct usine :`;
    }

    return res.json({
      reply: explanation,
      productIds: matchedIds,
      suggestedQuestions: [
        'Quels sont les articles en stock limité ?',
        'Montre-moi les serviettes et rideaux',
        'Comment profiter de la livraison offerte ?',
      ],
    });
  } catch (err: any) {
    console.error('Erreur Gemini API:', err);
    return res.status(500).json({
      error: err.message || 'Erreur interne de génération',
      reply: "Je rencontre une difficulté temporaire pour contacter l'IA. Voici nos recommandations principales :",
      productIds: ['aly-towel-set', 'aly-curtains-linen'],
    });
  }
});

const isProduction = process.env.NODE_ENV === 'production';
const PORT = 3000;

if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur AlyExpress démarré sur http://0.0.0.0:${PORT}`);
});
