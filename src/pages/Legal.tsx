export default function Legal() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-20">
      <section className="py-16 bg-[#0d0d0d] border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Informations Légales</p>
          <h1 className="section-title text-white">Mentions Légales &<br /><span className="gold-text">Confidentialité</span></h1>
          <div className="gold-divider" style={{ margin: '1.5rem 0' }} />
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-l-2 border-gold pl-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              1. Mentions Légales
            </h2>
            <div className="text-gray-400 text-sm leading-relaxed space-y-3 pl-4">
              <p><span className="text-gold">Raison sociale :</span> Le Grand Barbershop</p>
              <p><span className="text-gold">Forme juridique :</span> Entreprise individuelle</p>
              <p><span className="text-gold">Siège social :</span> Lot II B 45, Ankorondrano, Antananarivo 101, Madagascar</p>
              <p><span className="text-gold">Téléphone :</span> +261 34 00 000 00</p>
              <p><span className="text-gold">Email :</span> contact@legrand-barbershop.mg</p>
              <p><span className="text-gold">Directeur de publication :</span> Karim Andriamahefazafy</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-l-2 border-gold pl-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              2. Propriété Intellectuelle
            </h2>
            <div className="text-gray-400 text-sm leading-relaxed space-y-3 pl-4">
              <p>L'ensemble du contenu de ce site web (textes, images, logos, graphismes) est protégé par le droit d'auteur et appartient à Le Grand Barbershop ou à ses partenaires. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-l-2 border-gold pl-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              3. Politique de Confidentialité
            </h2>
            <div className="text-gray-400 text-sm leading-relaxed space-y-3 pl-4">
              <p>Nous collectons uniquement les données nécessaires à la gestion de vos réservations : nom complet, adresse email, numéro de téléphone et informations de rendez-vous.</p>
              <p>Ces données ne sont en aucun cas vendues, louées ou partagées avec des tiers à des fins commerciales. Elles sont utilisées exclusivement pour vous contacter concernant vos réservations.</p>
              <p>Conformément aux lois en vigueur sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en nous contactant à l'adresse email mentionnée ci-dessus.</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-l-2 border-gold pl-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              4. Collecte de Données
            </h2>
            <div className="text-gray-400 text-sm leading-relaxed space-y-3 pl-4">
              <p><span className="text-white">Données collectées lors de la réservation :</span> Nom, email, téléphone, service choisi, date et heure de rendez-vous, mode de paiement.</p>
              <p><span className="text-white">Finalité :</span> Gestion et confirmation des rendez-vous, contact client.</p>
              <p><span className="text-white">Durée de conservation :</span> Les données sont conservées pendant une durée de 3 ans à compter de votre dernière interaction.</p>
              <p><span className="text-white">Sécurité :</span> Vos données sont stockées de manière sécurisée via Supabase, avec chiffrement en transit et au repos.</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-l-2 border-gold pl-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              5. Cookies
            </h2>
            <div className="text-gray-400 text-sm leading-relaxed pl-4">
              <p>Ce site peut utiliser des cookies techniques nécessaires à son fonctionnement. Aucun cookie de traçage publicitaire n'est utilisé.</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-l-2 border-gold pl-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              6. Responsabilité
            </h2>
            <div className="text-gray-400 text-sm leading-relaxed pl-4">
              <p>Le Grand Barbershop s'efforce de maintenir les informations de ce site à jour et exactes. Toutefois, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des informations publiées. L'utilisation de ce site se fait sous la responsabilité de l'utilisateur.</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-l-2 border-gold pl-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              7. Contact pour les Droits
            </h2>
            <div className="text-gray-400 text-sm leading-relaxed pl-4">
              <p>Pour exercer vos droits ou pour toute question relative à la protection de vos données personnelles, vous pouvez nous contacter à :</p>
              <p className="text-gold mt-2">privacy@legrand-barbershop.mg</p>
            </div>
          </div>

          <p className="text-gray-700 text-xs pl-4">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </section>
    </div>
  );
}
