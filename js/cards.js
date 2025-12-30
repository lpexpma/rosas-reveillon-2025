// js/cards.js
// ============================================================
// ROSAS — DECK (Mode Salon)
// Version: 2.0.0-salon
// - API: window.RosasCards
// ============================================================

(() => {
  "use strict";

  // -------------------------
  // THÈMES DISPONIBLES
  // -------------------------
  const THEMES = [
    { key: "HUMOUR", label: "Humour", icon: "😂" },
    { key: "SEXY", label: "Sexy", icon: "😈" },
    { key: "ACTION", label: "Action", icon: "🎭" },
    { key: "POLL", label: "Sondage", icon: "📊" },
    { key: "DINGUE", label: "Fou", icon: "🤯" },
    { key: "DICE", label: "Dé", icon: "🎲" },
    { key: "PHOTO", label: "Photo", icon: "📸" },
    { key: "NEVER", label: "Jamais", icon: "🙅" },
    { key: "RULE", label: "Règle", icon: "📜" },
  ];

// -------------------------
// BASE DE DONNÉES DES CARTES
// -------------------------
const CARDS_DATABASE = {
  HUMOUR: [
        { id: "HUMOUR_001", theme: "HUMOUR", text: "Ce soir, quelle est la phrase la plus probable que quelqu'un va dire… puis regretter immédiatement ?", canPass: true, drink: 0, ui: "plain", duration: "medium" },
        { id: "HUMOUR_002", theme: "HUMOUR", text: "Si cette soirée avait une bande-annonce, quelle serait LA phrase d'accroche ?", canPass: true, drink: 0, ui: "plain", duration: "medium" },
        { id: "HUMOUR_003", theme: "HUMOUR", text: "Qui ici a déjà la tête de quelqu'un qui a faim… mais fait semblant d'être très chic ?", canPass: true, drink: 0, ui: "plain", duration: "short" },
        { id: "HUMOUR_004", theme: "HUMOUR", text: "Chacun donne un surnom à son verre (soft accepté). Votez pour le meilleur : le gagnant distribue 1 gorgée.", canPass: false, drink: 1, ui: "poll", duration: "medium", options: ["Option 1", "Option 2", "Option 3"] },
        { id: "HUMOUR_005", theme: "HUMOUR", text: "Quelle est la chose la plus 'adulte' que vous avez faite aujourd'hui… avant de redevenir des enfants ce soir ?", canPass: true, drink: 0, ui: "plain", duration: "medium" },
        { id: "HUMOUR_006", theme: "HUMOUR", text: "Défi express : pendant 10 secondes, décris ta journée comme si tu étais un présentateur météo.", canPass: false, drink: 0, ui: "plain", duration: "short" },
        { id: "HUMOUR_007", theme: "HUMOUR", text: "Qui ici serait le plus crédible en 'expert du réveillon' à la télé ? Pourquoi ?", canPass: true, drink: 0, ui: "plain", duration: "medium" },
        { id: "HUMOUR_008", theme: "HUMOUR", text: "Chacun dit une 'résolution' totalement réaliste… mais minuscule. (Ex : 'boire de l'eau… parfois')", canPass: false, drink: 0, ui: "plain", duration: "medium" },
        { id: "HUMOUR_009", theme: "HUMOUR", text: "Si votre humeur était un plat ce soir, ce serait quoi ? (Et pourquoi ça donne faim ?)", canPass: true, drink: 0, ui: "plain", duration: "medium" },
        { id: "HUMOUR_010", theme: "HUMOUR", text: "Qui a le plus la démarche 'je suis arrivé pour briller' ? La personne désignée distribue 1 gorgée.", canPass: true, drink: 1, ui: "designate", duration: "short" },
        { id: "HUMOUR_011", theme: "HUMOUR", text: "Chacun avoue son 'petit rituel' ridicule avant une soirée (même si c'est juste 'se convaincre').", canPass: false, drink: 0, ui: "plain", duration: "medium" },
        { id: "HUMOUR_012", theme: "HUMOUR", text: "Si cette soirée était une émission, ce serait : concours, téléréalité, documentaire animalier ou thriller ? Vote à main levée.", canPass: false, drink: 0, ui: "poll", duration: "medium", options: ["Concours", "Téléréalité", "Documentaire", "Thriller"] },
        { id: "HUMOUR_013", theme: "HUMOUR", text: "Décris la personne à ta droite comme un personnage de dessin animé… avec bienveillance.", canPass: true, drink: 0, ui: "plain", duration: "short" },
        { id: "HUMOUR_014", theme: "HUMOUR", text: "Quel est le 'moment où tu fais semblant d'être raisonnable' ce soir ? (Montre-le maintenant en mime.)", canPass: true, drink: 0, ui: "plain", duration: "short" },
        { id: "HUMOUR_015", theme: "HUMOUR", text: "Annonce solennelle : chacun invente un nom de cocktail pour ce réveillon. Le groupe vote pour le plus stylé.", canPass: false, drink: 0, ui: "poll", duration: "long" },
	{ id:"HUMOUR_016", theme:"HUMOUR", text:"Tour de table : votre plus grande qualité ce soir… mais dite comme une pub de parfum.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_017", theme:"HUMOUR", text:"Défi express : fais une entrée de star (3 secondes). Applaudimètre du groupe.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_018", theme:"HUMOUR", text:"Qui ici a déjà une tête de 'j’ai trop confiance en moi' ? La personne choisie distribue 1 gorgée.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_019", theme:"HUMOUR", text:"Inventez le nom d’un documentaire Netflix sur votre soirée. Votez pour le meilleur.", canPass:false, drink:0, ui:"poll", duration:"medium", options:["Titre 1","Titre 2","Titre 3"] },
	{ id:"HUMOUR_020", theme:"HUMOUR", text:"Chacun avoue son ‘talent inutile’. Le groupe décide si c’est vrai ou mytho.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_021", theme:"HUMOUR", text:"Imite (gentiment) une pub : “Rosas — le réveillon où même l’eau a du charisme”.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_022", theme:"HUMOUR", text:"Qui a le rire le plus contagieux ? La personne désignée offre 1 gorgée à qui elle veut.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_023", theme:"HUMOUR", text:"Défi : raconte ton dernier message envoyé comme si c’était un discours politique.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_024", theme:"HUMOUR", text:"Tout le monde choisit un mot chic. Interdiction de dire un mot “simple” à la place pendant 2 tours.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Remplacer un mot simple par un mot chic pendant 2 tours" },
	{ id:"HUMOUR_025", theme:"HUMOUR", text:"La meilleure excuse “j’ai 5 minutes de retard”. Chacun en propose une. Vote.", canPass:false, drink:0, ui:"poll", duration:"medium", options:["Excuse A","Excuse B","Excuse C"] },
	{ id:"HUMOUR_026", theme:"HUMOUR", text:"Qui est le plus probable de finir par faire un discours émouvant… sur le fromage ? Désignez.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_027", theme:"HUMOUR", text:"Défi : fais une météo du réveillon (température émotionnelle, risque de drama, vents de fête).", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_028", theme:"HUMOUR", text:"Chacun donne un nom de code d’agent secret à la personne à sa gauche.", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_029", theme:"HUMOUR", text:"Qui a l’énergie “je vais mettre l’ambiance même si personne n’a demandé” ? La personne choisie boit 1 gorgée.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_030", theme:"HUMOUR", text:"Défi : fais une déclaration solennelle… à ton verre (remerciements inclus).", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_031", theme:"HUMOUR", text:"Le groupe invente une règle absurde de noblesse : “à Rosas, on ne…”. La règle dure 1 tour.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Règle collective inventée, durée 1 tour" },
	{ id:"HUMOUR_032", theme:"HUMOUR", text:"Qui a le plus le style “j’ai prévu une story” ? La personne choisie distribue 1 gorgée.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_033", theme:"HUMOUR", text:"Chacun fait un compliment à quelqu’un… mais façon annonce de gare.", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_034", theme:"HUMOUR", text:"Si ce réveillon avait un slogan publicitaire, ce serait quoi ? (Une phrase max.)", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_035", theme:"HUMOUR", text:"Vote : qui survivrait le mieux dans une émission de cuisine… sans savoir cuisiner ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Le groupe"] },
	{ id:"HUMOUR_036", theme:"HUMOUR", text:"Défi : raconte une anecdote… mais en commençant par “Il était une fois, la dignité…”.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_037", theme:"HUMOUR", text:"Chacun choisit une ‘résolution’ ridiculement précise (ex: “boire un verre d’eau à 00:07”).", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_038", theme:"HUMOUR", text:"Qui a la meilleure tête de “je comprends rien mais j’acquiesce” ? Désignez. Elle distribue 1 gorgée.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_039", theme:"HUMOUR", text:"Défi : fais la voix off d’un animal qui observe la soirée (bienveillant).", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_040", theme:"HUMOUR", text:"Le groupe vote : quel objet de la pièce est le plus “VIP” ?", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_041", theme:"HUMOUR", text:"Annonce : chacun invente un ‘titre de noblesse’ pour soi (ex: Duchesse du Chips).", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_042", theme:"HUMOUR", text:"Défi : mime “je fais semblant d’être raisonnable”. Le groupe note de 1 à 10.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_043", theme:"HUMOUR", text:"Qui ici a déjà un rire de fin de soirée… alors qu’il est tôt ? La personne choisie boit 1 gorgée.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_044", theme:"HUMOUR", text:"Tour de table : votre ‘pire’ talent de danse décrit en 3 mots.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_045", theme:"HUMOUR", text:"Inventez un toast ultra chic… pour un truc banal (ex: les chaussettes).", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_046", theme:"HUMOUR", text:"Vote : qui est le plus probable de se mettre à ranger à 2h du matin ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Personne"] },
	{ id:"HUMOUR_047", theme:"HUMOUR", text:"Défi : parle comme un guide de musée pendant 30 secondes en décrivant la table.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_048", theme:"HUMOUR", text:"Qui a le talent de rendre n’importe quoi dramatique ? La personne choisie distribue 1 gorgée.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_049", theme:"HUMOUR", text:"Chacun propose un nom de groupe pour votre équipe de réveillon. Vote final.", canPass:false, drink:0, ui:"poll", duration:"long", options:["Nom A","Nom B","Nom C"] },
	{ id:"HUMOUR_050", theme:"HUMOUR", text:"Défi : raconte un souvenir gênant… mais comme une victoire héroïque.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_051", theme:"HUMOUR", text:"Minute Oscar : chacun fait un discours de remerciement… pour avoir mis ses chaussures.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_052", theme:"HUMOUR", text:"Qui ici serait le meilleur ‘coach de soirée’ ? La personne choisie donne un conseil à chacun.", canPass:true, drink:0, ui:"plain", duration:"long" },
	{ id:"HUMOUR_053", theme:"HUMOUR", text:"Défi : fais une pub pour le silence pendant 10 secondes. (Très sérieux.)", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_054", theme:"HUMOUR", text:"Désignez la personne la plus susceptible de perdre son téléphone ce soir. Elle boit 1 gorgée “préventive”.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_055", theme:"HUMOUR", text:"Chacun invente une ‘fausse’ tradition Rosas (ex: applaudir quand quelqu’un ouvre une bouteille).", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_056", theme:"HUMOUR", text:"Défi : fais la version “journal télé” de votre apéro (évènements majeurs, correspondants spéciaux).", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_057", theme:"HUMOUR", text:"Qui a le plus l’air d’un personnage de film de braquage chic ? La personne choisie distribue 1 gorgée.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_058", theme:"HUMOUR", text:"Tour de table : votre ‘excuse’ pour ne pas faire le dry January.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_059", theme:"HUMOUR", text:"Défi : mime “je reviens, je vais juste prendre de l’eau” (et tout le monde sait que c’est faux).", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_060", theme:"HUMOUR", text:"Vote : qui est le plus probable de commencer une danse… puis d’abandonner au bout de 6 secondes ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Ça dépend de la musique"] },
	{ id:"HUMOUR_061", theme:"HUMOUR", text:"Chacun donne à la soirée un sous-titre : “Rosas 2025 : …”.", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_062", theme:"HUMOUR", text:"Défi : fais un commentaire sportif sur quelqu’un qui se sert à boire (style match).", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_063", theme:"HUMOUR", text:"Désignez la personne la plus élégante… même quand elle mange. Elle offre 1 gorgée à quelqu’un.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_064", theme:"HUMOUR", text:"Tour de table : votre plus grosse ‘fierté’ inutile de l’année.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_065", theme:"HUMOUR", text:"Défi : invente une règle de politesse Rosas (ex: saluer le frigo). Elle dure 1 tour.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Règle de politesse inventée (1 tour)" },
	{ id:"HUMOUR_066", theme:"HUMOUR", text:"Vote : qui ferait le meilleur maître de cérémonie des toasts ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Laurent (évidemment)"] },
	{ id:"HUMOUR_067", theme:"HUMOUR", text:"Défi : raconte ton année en 3 titres de chansons… inventés.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_068", theme:"HUMOUR", text:"Désignez la personne la plus susceptible de dire “on fait juste un petit jeu” puis d’y passer 2h.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_069", theme:"HUMOUR", text:"Défi : fais une voix de luxe pour annoncer… le dessert.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_070", theme:"HUMOUR", text:"Tour de table : une chose que vous faites ‘comme si c’était normal’ mais ça ne l’est pas.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_071", theme:"HUMOUR", text:"Qui a la meilleure tête de ‘j’écoute’ alors qu’il pense au buffet ? Désignez. Elle boit 1 gorgée.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_072", theme:"HUMOUR", text:"Défi : fais un toast de 10 secondes… sans utiliser les mots santé, amour, bonheur.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_073", theme:"HUMOUR", text:"Vote : qui est le plus probable de sortir une phrase très profonde… complètement par hasard ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Tout le monde après minuit"] },
	{ id:"HUMOUR_074", theme:"HUMOUR", text:"Défi : décris ta tenue comme si c’était une œuvre d’art contemporain.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_075", theme:"HUMOUR", text:"Chacun invente une petite ‘croyance’ de réveillon (ex: si tu éternues, tu dois complimenter quelqu’un).", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_076", theme:"HUMOUR", text:"Désignez la personne la plus probable de se faire un ami dans la file d’attente des toilettes.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_077", theme:"HUMOUR", text:"Défi : imite une sonnerie de téléphone… et le groupe doit deviner l’émotion (panique, joie, mystère).", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_078", theme:"HUMOUR", text:"Vote : qui ferait le meilleur chauffeur de taxi à 4h du matin (histoires incluses) ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Personne, c’est trop"] },
	{ id:"HUMOUR_079", theme:"HUMOUR", text:"Défi : raconte un truc banal (aller acheter du pain) comme une mission dangereuse.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_080", theme:"HUMOUR", text:"Chacun donne un ‘titre LinkedIn’ à sa personnalité ce soir. (Ex: Responsable Ambiance Senior)", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_081", theme:"HUMOUR", text:"Désignez la personne qui a le plus l’air de connaître le barman… même s’il n’y en a pas.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_082", theme:"HUMOUR", text:"Défi : fais un ‘pitch’ d’investisseur pour convaincre quelqu’un de goûter un snack.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_083", theme:"HUMOUR", text:"Vote : qui est le plus probable de lancer un débat sur un sujet inutile (ex: meilleure fourchette) ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Nous tous"] },
	{ id:"HUMOUR_084", theme:"HUMOUR", text:"Défi : parle comme un personnage très riche qui découvre la simplicité (ex: “un verre d’eau… fascinant”).", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_085", theme:"HUMOUR", text:"Tour de table : votre ‘plus beau’ mensonge social (ex: “oui oui, je reviens vite”).", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_086", theme:"HUMOUR", text:"Désignez la personne la plus susceptible de dire “on se fait une petite photo ?” et d’en faire 47.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_087", theme:"HUMOUR", text:"Défi : fais un commentaire de mode sur quelqu’un… façon défilé.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_088", theme:"HUMOUR", text:"Vote : qui est le plus probable de donner un surnom à tout le monde ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Moi (je l’assume)"] },
	{ id:"HUMOUR_089", theme:"HUMOUR", text:"Défi : raconte un moment où tu as voulu être discret… et tu as échoué.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_090", theme:"HUMOUR", text:"Le groupe crée un ‘prix’ de la soirée (ex: Prix du Regard Mystérieux). À qui il va, et pourquoi ?", canPass:false, drink:0, ui:"plain", duration:"long" },
	{ id:"HUMOUR_091", theme:"HUMOUR", text:"Désignez la personne la plus probable de faire une blague au mauvais moment (mais avec charme).", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_092", theme:"HUMOUR", text:"Défi : fais une annonce “service client” pour calmer une mini-panique imaginaire.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_093", theme:"HUMOUR", text:"Vote : qui est le plus probable de finir par raconter sa vie à quelqu’un… dans la cuisine ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Tout le monde après 2 verres"] },
	{ id:"HUMOUR_094", theme:"HUMOUR", text:"Défi : imite quelqu’un qui essaie d’être ‘très adulte’ en soirée.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_095", theme:"HUMOUR", text:"Tour de table : la chose la plus ‘chic’ que vous avez déjà faite… mais c’était un malentendu.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_096", theme:"HUMOUR", text:"Désignez la personne la plus probable de dire “je ne bois presque pas” (ce soir). Elle boit 1 gorgée.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_097", theme:"HUMOUR", text:"Défi : fais un mini stand-up de 20 secondes sur un sujet neutre (la météo, les chaussons, les chips).", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_098", theme:"HUMOUR", text:"Vote : qui ferait le meilleur organisateur de réveillon… et qui ferait le pire ?", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_099", theme:"HUMOUR", text:"Défi : décris quelqu’un ici comme un ‘super-héros du quotidien’ (un pouvoir marrant et gentil).", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_100", theme:"HUMOUR", text:"Tour de table : votre ‘phrase signature’ de soirée (celle que vous finissez toujours par dire).", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_101", theme:"HUMOUR", text:"Désignez la personne la plus probable de devenir philosophe à 00:30. Elle distribue 1 gorgée.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_102", theme:"HUMOUR", text:"Défi : fais une déclaration d’amour… au canapé / à la chaise / au chauffage.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_103", theme:"HUMOUR", text:"Vote : qui est le plus probable de retrouver un objet perdu… juste en ‘sentant’ où il est ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","La chance pure"] },
	{ id:"HUMOUR_104", theme:"HUMOUR", text:"Défi : fais une voix de bande-annonce dramatique pour annoncer le prochain tour de jeu.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_105", theme:"HUMOUR", text:"Tour de table : votre moment préféré de ce soir… imaginé à l’avance (prémonition).", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_106", theme:"HUMOUR", text:"Désignez la personne la plus probable de ‘négocier’ une règle du jeu. Elle boit 1 gorgée.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_107", theme:"HUMOUR", text:"Défi : explique un truc simple (faire un toast) comme un professeur très sérieux.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_108", theme:"HUMOUR", text:"Vote : qui est le plus probable de se faire un ami avec… le voisin si on sonnait ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Personne, on reste discrets"] },
	{ id:"HUMOUR_109", theme:"HUMOUR", text:"Défi : mime “je goûte un truc inconnu mais je veux rester poli”.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_110", theme:"HUMOUR", text:"Le groupe choisit une ‘phrase officielle’ à répéter quand quelqu’un valide une carte. (Ex: “Rosas approuve”.)", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_111", theme:"HUMOUR", text:"Désignez la personne la plus probable de faire une chorégraphie… sans musique.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_112", theme:"HUMOUR", text:"Défi : raconte une ‘mini honte’ du quotidien… mais fin heureuse obligatoire.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_113", theme:"HUMOUR", text:"Vote : qui a le plus l’énergie “je connais un raccourci” (même dans un salon) ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Laurent (il connaît tout)"] },
	{ id:"HUMOUR_114", theme:"HUMOUR", text:"Défi : fais un toast de 7 secondes exactement. Le groupe compte (et juge).", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"HUMOUR_115", theme:"HUMOUR", text:"Tour de table : votre meilleure “technique” pour avoir l’air à l’aise sur une photo.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_116", theme:"HUMOUR", text:"Désignez la personne la plus probable de dire “on fait une dernière” (et d’en refaire deux). Elle boit 1 gorgée.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"HUMOUR_117", theme:"HUMOUR", text:"Défi : fais une annonce d’hôtesse de l’air pour expliquer la soirée (sorties de secours incluses).", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_118", theme:"HUMOUR", text:"Vote : qui est le plus probable de se souvenir de tout demain matin ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Personne, c’est Rosas"] },
	{ id:"HUMOUR_119", theme:"HUMOUR", text:"Défi : invente une phrase ‘motivation’ pour le groupe avant minuit (zéro cringe, challenge).", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"HUMOUR_120", theme:"HUMOUR", text:"Final humour : chacun dit une chose qu’il veut garder de cette soirée… en une phrase drôle et gentille.", canPass:false, drink:0, ui:"plain", duration:"long" },
      ],
      
      SEXY: [
	{ id:"SEXY_001", theme:"SEXY", text:"RÉPONDS OU BOIS : Qu’est-ce qui te rend immédiatement intrigué(e) chez quelqu’un ?", canPass:true, drink:1, ui:"plain", duration:"short" },
	{ id:"SEXY_002", theme:"SEXY", text:"VOTE : Qui attire l’attention sans rien dire ? (Élu(e) distribue 1.)", canPass:true, drink:0, ui:"poll", duration:"short" },
	{ id:"SEXY_003", theme:"SEXY", text:"FAIS-LE OU BOIS : Compliment chic et légèrement piquant à quelqu’un.", canPass:true, drink:1, ui:"plain", duration:"short" },
	{ id:"SEXY_004", theme:"SEXY", text:"RÉPONDS OU BOIS : Regard ou voix — lequel te déstabilise le plus ?", canPass:true, drink:1, ui:"plain", duration:"short" },
	{ id:"SEXY_005", theme:"SEXY", text:"VOTE : Qui semble plus audacieux(se) qu’il/elle ne le montre ?", canPass:true, drink:0, ui:"poll", duration:"short" },
	{ id:"SEXY_006", theme:"SEXY", text:"FAIS-LE OU BOIS : Toast ambigu à 'ce qui pourrait arriver'.", canPass:true, drink:1, ui:"plain", duration:"short" },
	{ id:"SEXY_007", theme:"SEXY", text:"RÉPONDS OU BOIS : Quelle attitude te fait changer d’avis sur quelqu’un ?", canPass:true, drink:1, ui:"plain", duration:"short" },
	{ id:"SEXY_008", theme:"SEXY", text:"VOTE : Qui maîtrise le mieux l’art du sous-entendu ?", canPass:true, drink:0, ui:"poll", duration:"short" },
	{ id:"SEXY_009", theme:"SEXY", text:"FAIS-LE OU BOIS : Regarde quelqu’un 3 secondes et souris.", canPass:true, drink:1, ui:"plain", duration:"short" },
	{ id:"SEXY_010", theme:"SEXY", text:"RÉPONDS OU BOIS : Quelle ambiance te rend plus joueur(se) ?", canPass:true, drink:1, ui:"plain", duration:"short" },
	{ id:"SEXY_011", theme:"SEXY", text:"VOTE : Qui est clairement une mauvaise bonne idée ?", canPass:true, drink:0, ui:"poll", duration:"short" },
	{ id:"SEXY_012", theme:"SEXY", text:"FAIS-LE OU BOIS : Phrase ambiguë à quelqu’un : 'Intéressant…'", canPass:true, drink:1, ui:"plain", duration:"short" },
	{ id:"SEXY_013", theme:"SEXY", text:"RÉPONDS OU BOIS : Quelle qualité te rend difficile à ignorer ?", canPass:true, drink:1, ui:"plain", duration:"short" },
	{ id:"SEXY_014", theme:"SEXY", text:"VOTE : Qui ferait le meilleur rôle principal ce soir ?", canPass:true, drink:0, ui:"poll", duration:"short" },
	{ id:"SEXY_015", theme:"SEXY", text:"FAIS-LE OU BOIS : Compliment piquant sans dire 'tu'.", canPass:true, drink:1, ui:"plain", duration:"short" },
	{ id:"SEXY_016", theme:"SEXY", text:"RÉPONDS OU BOIS : Quelle situation te rend plus audacieux(se) que prévu ?", canPass:true, drink:1, ui:"plain", duration:"medium" },
	{ id:"SEXY_017", theme:"SEXY", text:"VOTE : Qui joue clairement avec la tension ?", canPass:true, drink:0, ui:"poll", duration:"short" },
	{ id:"SEXY_018", theme:"SEXY", text:"FAIS-LE OU BOIS : Décris quelqu’un comme un cocktail.", canPass:true, drink:1, ui:"plain", duration:"short" },
	{ id:"SEXY_019", theme:"SEXY", text:"RÉPONDS OU BOIS : Séduction discrète ou audace assumée ?", canPass:true, drink:1, ui:"plain", duration:"short" },
	{ id:"SEXY_020", theme:"SEXY", text:"VOTE : Qui attire plus qu’il/elle ne le pense ?", canPass:true, drink:0, ui:"poll", duration:"short" },
	{ id:"SEXY_021", theme:"SEXY", text:"IMMUNITÉ SEXY : 1 tour sans boire. À chaque toast, tu fais un compliment coquin.", canPass:false, drink:0, ui:"rule", duration:"medium" },
	{ id:"SEXY_022", theme:"SEXY", text:"IMMUNITÉ : Protège quelqu’un d’un boire. Tu boiras à sa place.", canPass:false, drink:0, ui:"rule", duration:"short" },
	{ id:"SEXY_023", theme:"SEXY", text:"IMMUNITÉ : 1 tour sans boire mais tu dois choisir qui boit à ta place.", canPass:false, drink:0, ui:"rule", duration:"short" },
	{ id:"SEXY_024", theme:"SEXY", text:"IMMUNITÉ : Tu ignores la prochaine carte… mais offres un compliment piquant.", canPass:false, drink:0, ui:"rule", duration:"short" },
	{ id:"SEXY_025", theme:"SEXY", text:"IMMUNITÉ : 1 tour safe. En échange, tu réponds à la prochaine question.", canPass:false, drink:0, ui:"rule", duration:"short" },
	{ id:"SEXY_026", theme:"SEXY", text:"SABOTAGE : Mot interdit 'non' pendant 1 tour. Chaque oubli = 1 gorgée.", canPass:false, drink:0, ui:"rule", duration:"short" },
	{ id:"SEXY_027", theme:"SEXY", text:"SABOTAGE : Interdiction de détourner le regard quand on te parle. 1 tour.", canPass:false, drink:0, ui:"rule", duration:"short" },
	{ id:"SEXY_028", theme:"SEXY", text:"SABOTAGE : Impossible de refuser pendant 1 tour. Chaque refus = 1 gorgée.", canPass:false, drink:0, ui:"rule", duration:"short" },
	{ id:"SEXY_029", theme:"SEXY", text:"SABOTAGE : Tu dois répondre par 'peut-être' pendant 1 tour.", canPass:false, drink:0, ui:"rule", duration:"short" },
	{ id:"SEXY_030", theme:"SEXY", text:"DUEL : Regard 5 secondes. Le premier qui rit boit 2.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_031", theme:"SEXY", text:"DUEL : Sourire interdit 5 secondes. Perdant boit 2.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_032", theme:"SEXY", text:"DUEL : Silence total 8 secondes. Le premier qui parle boit 2.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_033", theme:"SEXY", text:"DUEL : Qui détourne le regard perd et boit 2.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_034", theme:"SEXY", text:"CHOISIS : Quelqu’un boit 2 OU révèle un secret soft (flirt, audace, situation ambiguë).", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"SEXY_035", theme:"SEXY", text:"CHOIX CRUEL : 1 personne boit 3 OU tout le monde boit 1.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_036", theme:"SEXY", text:"ENJEU : Distribue 3 gorgées avec une justification volontairement ambiguë.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_037", theme:"SEXY", text:"CHOISIS : Donne 2 gorgées à quelqu’un OU fais-lui un compliment piquant devant le groupe.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"SEXY_038", theme:"SEXY", text:"POUVOIR : Choisis un joueur. À sa prochaine gorgée, il/elle boit 1 de plus.", canPass:false, drink:0, ui:"rule", duration:"short" },
	{ id:"SEXY_039", theme:"SEXY", text:"CHOIX : Bois 1 maintenant OU choisis qui boira 2 plus tard dans le tour.", canPass:true, drink:1, ui:"plain", duration:"short" },
	{ id:"SEXY_040", theme:"SEXY", text:"ENJEU : Distribue 2 gorgées. Les personnes concernées doivent se regarder en trinquant.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_041", theme:"SEXY", text:"CHOISIS : Quelqu’un boit 2 OU répond à une question sexy soft de ton choix.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"SEXY_042", theme:"SEXY", text:"POUVOIR : Tu décides qui sera le prochain joueur à piocher.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_043", theme:"SEXY", text:"CHOIX CRUEL : Bois 2 OU fais boire 1 à trois personnes différentes.", canPass:true, drink:2, ui:"plain", duration:"short" },
	{ id:"SEXY_044", theme:"SEXY", text:"ENJEU : Offre 2 gorgées à quelqu’un… puis explique pourquoi en une phrase élégante.", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"SEXY_045", theme:"SEXY", text:"CHOISIS : Protège quelqu’un d’un boire ce tour-ci OU fais-lui boire 1 maintenant.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_046", theme:"SEXY", text:"POUVOIR : Pendant 1 tour, tu peux redistribuer une gorgée qui ne t’était pas destinée.", canPass:false, drink:0, ui:"rule", duration:"short" },
	{ id:"SEXY_047", theme:"SEXY", text:"CHOIX : Bois 1 OU impose un compliment piquant à deux joueurs.", canPass:true, drink:1, ui:"plain", duration:"medium" },
	{ id:"SEXY_048", theme:"SEXY", text:"ENJEU : Distribue 3 gorgées librement, mais jamais plus de 2 à la même personne.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_049", theme:"SEXY", text:"CHOISIS : Quelqu’un boit 2 OU doit porter un surnom choisi par toi pendant 1 tour.", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"SEXY_050", theme:"SEXY", text:"TRANSITION CLIMAX : Tout le monde boit 1… sauf la personne que tu désignes.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_051", theme:"SEXY", text:"VOTE : Qui dégage le plus de tension sexy ce soir ? La personne désignée distribue 2 gorgées.", canPass:true, drink:0, ui:"designate", duration:"medium" },
	{ id:"SEXY_052", theme:"SEXY", text:"RÉPONDS OU BOIS : Qu’est-ce qui te fait craquer immédiatement chez quelqu’un, sans contact ?", canPass:true, drink:1, ui:"plain", duration:"medium" },
	{ id:"SEXY_053", theme:"SEXY", text:"DUEL REGARD : Choisis quelqu’un. Regard intense 5 secondes. Le premier qui sourit boit 2.", canPass:false, drink:0, ui:"duel", duration:"short" },
	{ id:"SEXY_054", theme:"SEXY", text:"IMMUNITÉ SEXY : Tu ne bois pas pendant 1 tour, mais tu dois faire un compliment coquin à chaque toast.", canPass:false, drink:0, ui:"rule", duration:"medium" },
	{ id:"SEXY_055", theme:"SEXY", text:"CHOIX CRUEL : Bois 2 OU choisis deux personnes qui boivent 1.", canPass:true, drink:2, ui:"plain", duration:"short" },
	{ id:"SEXY_056", theme:"SEXY", text:"VOTE : Qui serait le plus dangereux en flirt ce soir ? La personne désignée boit 1.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"SEXY_057", theme:"SEXY", text:"SABOTAGE : Interdis à quelqu’un de dire « non » pendant 1 tour. À chaque oubli : 1 gorgée.", canPass:false, drink:0, ui:"rule", duration:"medium" },
	{ id:"SEXY_058", theme:"SEXY", text:"RÉPONDS OU BOIS : Quel type d’attention te fait fondre sans jamais te toucher ?", canPass:true, drink:1, ui:"plain", duration:"medium" },
	{ id:"SEXY_059", theme:"SEXY", text:"ENJEU COLLECTIF : Tout le monde boit 1… sauf ceux que tu regardes en silence pendant 3 secondes.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_060", theme:"SEXY", text:"FINAL PIQUANT : Tour de table — chacun offre un compliment piquant mais respectueux à quelqu’un.", canPass:false, drink:0, ui:"plain", duration:"long" },
	{ id:"SEXY_061", theme:"SEXY", text:"2 VÉRITÉS / 1 MENSONGE — Version strip symbolique : À la révélation, retire un accessoire visible.", canPass:false, drink:0, ui:"plain", duration:"long" },
	{ id:"SEXY_062", theme:"SEXY", text:"CHOIX CRUEL XXL : 1 personne boit 3 OU tout le monde boit 1 et te regarde trinquer.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_063", theme:"SEXY", text:"VOTE : Qui ici sait le mieux faire monter la tension sans parler ? La personne boit 1.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"SEXY_064", theme:"SEXY", text:"RITUEL : Choisis deux personnes. Elles trinquent ensemble et boivent 1 en se regardant.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_065", theme:"SEXY", text:"IMMUNITÉ FINALE : Tu es protégé du prochain boire, mais tu dois choisir qui boira à ta place.", canPass:false, drink:0, ui:"rule", duration:"medium" },
	{ id:"SEXY_066", theme:"SEXY", text:"RÉPONDS OU BOIS : Quel geste innocent peut devenir très troublant selon la personne ?", canPass:true, drink:1, ui:"plain", duration:"medium" },
	{ id:"SEXY_067", theme:"SEXY", text:"TOAST AMBIGU : Porte un toast à quelqu’un… sans jamais dire son prénom.", canPass:true, drink:1, ui:"plain", duration:"short" },
	{ id:"SEXY_068", theme:"SEXY", text:"CHOISIS : Donne 2 gorgées OU échange un regard silencieux de 5 secondes avec quelqu’un.", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_069", theme:"SEXY", text:"CLÔTURE TENSION : Tout le monde boit 1. La dernière personne à trinquer boit 1 de plus.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"SEXY_070", theme:"SEXY", text:"VOTE FINAL : Qui a été le plus dangereusement charmant ce soir ? La personne désignée distribue 2.", canPass:true, drink:0, ui:"designate", duration:"medium" },
	{ id: "SEXY_071", theme: "SEXY", text: "Qui ici embrasse le mieux selon vous ? (La personne désignée offre 1 gorgée à son voteur)", canPass: true, drink: 1, ui: "designate", duration: "short" },
        { id: "SEXY_072", theme: "SEXY", text: "Quel détail physique vous fait craquer instantanément chez quelqu'un ?", canPass: true, drink: 0, ui: "plain", duration: "medium" },
        { id: "SEXY_073", theme: "SEXY", text: "Qui pourrait le plus facilement séduire quelqu'un ce soir ? Justifiez en 1 phrase.", canPass: true, drink: 0, ui: "plain", duration: "medium" },
        { id: "SEXY_074", theme: "SEXY", text: "Quelle est la chose la plus sensuelle que vous avez faite cette semaine ? (Interprétation large autorisée)", canPass: true, drink: 0, ui: "plain", duration: "medium" },
        { id: "SEXY_075", theme: "SEXY", text: "Désignez la personne avec le regard le plus envoûtant. Elle choisit qui boit.", canPass: true, drink: 1, ui: "designate", duration: "short" },
        { id: "SEXY_076", theme: "SEXY", text: "Si vous deviez décrire votre énergie ce soir en 1 mot sensuel, ce serait…", canPass: true, drink: 0, ui: "plain", duration: "short" },
        { id: "SEXY_077", theme: "SEXY", text: "Quelle tenue vous fait vous sentir irrésistible ? (Détails optionnels)", canPass: true, drink: 0, ui: "plain", duration: "medium" },
        { id: "SEXY_078", theme: "SEXY", text: "Désignez 2 personnes qui auraient une alchimie évidente à l'écran. Elles trinquent ensemble.", canPass: true, drink: 1, ui: "designate", duration: "short" },
        { id: "SEXY_079", theme: "SEXY", text: "Quel est votre super-pouvoir séduction secret ? (Ex : écouter, faire rire, regard intense…)", canPass: true, drink: 0, ui: "plain", duration: "medium" },
        { id: "SEXY_080", theme: "SEXY", text: "Si cette soirée était un parfum, quelles notes aurait-elle ?", canPass: true, drink: 0, ui: "plain", duration: "medium" },
      ],

      
      ACTION: [
        { id: "ACTION_001", theme: "ACTION", text: "Parle avec un accent choisi pendant 2 tours. Si tu oublies, bois 1 gorgée.", canPass: false, drink: 1, ui: "rule", duration: "short", rule: "Accent obligatoire pendant 2 tours" },
        { id: "ACTION_002", theme: "ACTION", text: "Désigne 2 personnes qui doivent trinquer et boire ensemble.", canPass: false, drink: 1, ui: "designate", duration: "short" },
        { id: "ACTION_003", theme: "ACTION", text: "Interdiction de dire 'oui' ou 'non' jusqu'à ton prochain tour. Chaque infraction = 1 gorgée.", canPass: false, drink: 1, ui: "rule", duration: "short", rule: "Interdit de dire oui/non" },
        { id: "ACTION_004", theme: "ACTION", text: "Fais un compliment sincère à chaque personne présente. Prends 1 gorgée par compliment refusé.", canPass: false, drink: 2, ui: "plain", duration: "long" },
        { id: "ACTION_005", theme: "ACTION", text: "Invente une danse de 10 secondes. Tout le monde l'imite. Les récalcitrants boivent.", canPass: false, drink: 1, ui: "plain", duration: "medium" },
        { id: "ACTION_006", theme: "ACTION", text: "Tout le monde change de place. Les 2 derniers à bouger boivent.", canPass: false, drink: 1, ui: "plain", duration: "short" },
        { id: "ACTION_007", theme: "ACTION", text: "Joue une scène muette de 20 secondes. Le groupe devine. Si échec, bois 2 gorgées.", canPass: false, drink: 2, ui: "plain", duration: "medium" },
        { id: "ACTION_008", theme: "ACTION", text: "Règle temporaire : appeler les gens par des surnoms royaux. Oubli = 1 gorgée.", canPass: false, drink: 1, ui: "rule", duration: "short", rule: "Surnoms royaux obligatoires" },
        { id: "ACTION_009", theme: "ACTION", text: "Fais le tour du groupe et serre la main de chacun en regardant droit dans les yeux.", canPass: false, drink: 0, ui: "plain", duration: "medium" },
        { id: "ACTION_010", theme: "ACTION", text: "Organise un mini concours de pose. Votez. Le perdant boit.", canPass: false, drink: 1, ui: "poll", duration: "medium", options: ["Pose 1", "Pose 2", "Pose 3"] },
	{ id:"ACTION_011", theme:"ACTION", text:"Imite la démarche de quelqu’un du groupe pendant 10 secondes.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_012", theme:"ACTION", text:"Fais un toast improvisé à la soirée en 15 secondes maximum.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_013", theme:"ACTION", text:"Parle sans utiliser la lettre « A » jusqu’à ton prochain tour. Oubli = 1 gorgée.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Lettre A interdite" },
	{ id:"ACTION_014", theme:"ACTION", text:"Montre ta meilleure pose de photo pendant 5 secondes.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_015", theme:"ACTION", text:"Tout le monde tape dans ses mains en rythme. Le premier qui se trompe boit 1.", canPass:false, drink:1, ui:"plain", duration:"short" },
	{ id:"ACTION_016", theme:"ACTION", text:"Choisis quelqu’un : il/elle doit raconter un souvenir drôle en 20 secondes.", canPass:true, drink:0, ui:"designate", duration:"medium" },
	{ id:"ACTION_017", theme:"ACTION", text:"Change d’accessoire (verre, veste, montre) avec quelqu’un pendant 1 tour.", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"ACTION_018", theme:"ACTION", text:"Fais un compliment collectif en regardant chaque personne une fois.", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"ACTION_019", theme:"ACTION", text:"Mime une émotion tirée par le groupe (sans parler).", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_020", theme:"ACTION", text:"Tout le monde se lève. Le dernier debout boit 1.", canPass:false, drink:1, ui:"plain", duration:"short" },
	{ id:"ACTION_021", theme:"ACTION", text:"Parle comme si tu annonçais une météo dramatique pendant 15 secondes.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_022", theme:"ACTION", text:"Choisis deux personnes : elles doivent se regarder sans parler pendant 5 secondes.", canPass:false, drink:0, ui:"designate", duration:"short" },
	{ id:"ACTION_023", theme:"ACTION", text:"Applaudis quelqu’un sans raison. Les autres doivent suivre.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_024", theme:"ACTION", text:"Change de place avec quelqu’un de ton choix.", canPass:false, drink:0, ui:"designate", duration:"short" },
	{ id:"ACTION_025", theme:"ACTION", text:"Tout le monde boit 1… sauf toi.", canPass:false, drink:1, ui:"plain", duration:"short" },
	{ id:"ACTION_026", theme:"ACTION", text:"Règle : parler plus fort que nécessaire pendant 1 tour. Oubli = 1 gorgée.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Voix exagérée" },
	{ id:"ACTION_027", theme:"ACTION", text:"Distribue 2 gorgées à des personnes différentes.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_028", theme:"ACTION", text:"Imite la voix d’un personnage connu pendant 10 secondes.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_029", theme:"ACTION", text:"Choisis quelqu’un : il/elle décide qui boit 1.", canPass:true, drink:0, ui:"designate", duration:"short" },
	{ id:"ACTION_030", theme:"ACTION", text:"Tout le monde ferme les yeux. Tu touches une épaule. Cette personne boit 1.", canPass:false, drink:1, ui:"plain", duration:"short" },
	{ id:"ACTION_031", theme:"ACTION", text:"Interdiction de croiser les bras pendant 1 tour. Oubli = 1 gorgée.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Bras non croisés" },
	{ id:"ACTION_032", theme:"ACTION", text:"Fais une mini chorégraphie. Le groupe note. Si moyenne < 6/10, bois 1.", canPass:false, drink:1, ui:"plain", duration:"medium" },
	{ id:"ACTION_033", theme:"ACTION", text:"Choisis quelqu’un : il/elle doit faire une action de ton choix (safe).", canPass:true, drink:0, ui:"designate", duration:"medium" },
	{ id:"ACTION_034", theme:"ACTION", text:"Tout le monde boit 1… puis change de place.", canPass:false, drink:1, ui:"plain", duration:"short" },
	{ id:"ACTION_035", theme:"ACTION", text:"Parle uniquement par gestes pendant 15 secondes.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_036", theme:"ACTION", text:"Distribue 3 gorgées librement (max 2 par personne).", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_037", theme:"ACTION", text:"Fais un discours sérieux sur un sujet absurde choisi par le groupe.", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"ACTION_038", theme:"ACTION", text:"Choisis un partenaire. Vous trinquez et buvez 1 ensemble.", canPass:false, drink:1, ui:"designate", duration:"short" },
	{ id:"ACTION_039", theme:"ACTION", text:"Règle : tu dois regarder la personne qui parle pendant 1 tour. Oubli = 1.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Regard obligatoire" },
	{ id:"ACTION_040", theme:"ACTION", text:"Tout le monde tape du pied. Le dernier à suivre boit 1.", canPass:false, drink:1, ui:"plain", duration:"short" },
	{ id:"ACTION_041", theme:"ACTION", text:"Imite un métier choisi par le groupe pendant 15 secondes.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_042", theme:"ACTION", text:"Choisis quelqu’un : il/elle doit raconter une anecdote en 3 phrases max.", canPass:true, drink:0, ui:"designate", duration:"medium" },
	{ id:"ACTION_043", theme:"ACTION", text:"Tout le monde boit 1… sauf la personne la plus proche de toi.", canPass:false, drink:1, ui:"plain", duration:"short" },
	{ id:"ACTION_044", theme:"ACTION", text:"Parle comme si tu étais très pressé pendant 20 secondes.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_045", theme:"ACTION", text:"Distribue 2 gorgées sans expliquer pourquoi.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_046", theme:"ACTION", text:"Choisis quelqu’un : il/elle impose une action simple au prochain joueur.", canPass:true, drink:0, ui:"designate", duration:"medium" },
	{ id:"ACTION_047", theme:"ACTION", text:"Tout le monde se lève et s’assoit en même temps. Le dernier boit 1.", canPass:false, drink:1, ui:"plain", duration:"short" },
	{ id:"ACTION_048", theme:"ACTION", text:"Règle : pas de téléphone pendant 1 tour. Le premier qui regarde boit 1.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Téléphone interdit" },
	{ id:"ACTION_049", theme:"ACTION", text:"Fais une pose figée pendant 10 secondes.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_050", theme:"ACTION", text:"Tout le monde boit 1 en même temps.", canPass:false, drink:1, ui:"plain", duration:"short" },
	{ id:"ACTION_051", theme:"ACTION", text:"Choisis deux personnes : elles trinquent et échangent leur place.", canPass:false, drink:0, ui:"designate", duration:"short" },
	{ id:"ACTION_052", theme:"ACTION", text:"Fais un toast final à l’année à venir.", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"ACTION_053", theme:"ACTION", text:"Tout le monde applaudit quelqu’un de ton choix.", canPass:false, drink:0, ui:"designate", duration:"short" },
	{ id:"ACTION_054", theme:"ACTION", text:"Distribue 3 gorgées pour conclure ce tour.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_055", theme:"ACTION", text:"Change de place avec la personne la plus éloignée de toi.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_056", theme:"ACTION", text:"Tout le monde boit 1… puis se rassoit différemment.", canPass:false, drink:1, ui:"plain", duration:"short" },
	{ id:"ACTION_057", theme:"ACTION", text:"Imite la célébration d’une victoire sportive.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_058", theme:"ACTION", text:"Choisis quelqu’un : il/elle distribue 2 gorgées.", canPass:true, drink:0, ui:"designate", duration:"short" },
	{ id:"ACTION_059", theme:"ACTION", text:"Tout le monde se lève. Le premier assis boit 1.", canPass:false, drink:1, ui:"plain", duration:"short" },
	{ id:"ACTION_060", theme:"ACTION", text:"Fais un signe de remerciement à chaque joueur.", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"ACTION_061", theme:"ACTION", text:"Règle finale : parler uniquement en souriant pendant 1 tour.", canPass:false, drink:0, ui:"rule", duration:"short", rule:"Sourire obligatoire" },
	{ id:"ACTION_062", theme:"ACTION", text:"Distribue 2 gorgées et termine par un toast.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_063", theme:"ACTION", text:"Tout le monde boit 1 pour l’hôte.", canPass:false, drink:1, ui:"plain", duration:"short" },
	{ id:"ACTION_064", theme:"ACTION", text:"Imite la fatigue de fin de soirée pendant 10 secondes.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_065", theme:"ACTION", text:"Choisis quelqu’un : il/elle boit 1 et choisit le prochain joueur.", canPass:true, drink:1, ui:"designate", duration:"short" },
	{ id:"ACTION_066", theme:"ACTION", text:"Tout le monde applaudit la soirée.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_067", theme:"ACTION", text:"Dernière distribution : 3 gorgées max, librement.", canPass:false, drink:0, ui:"plain", duration:"short" },
	{ id:"ACTION_068", theme:"ACTION", text:"Fais un dernier toast collectif.", canPass:false, drink:0, ui:"plain", duration:"medium" },
	{ id:"ACTION_069", theme:"ACTION", text:"Tout le monde boit 1… lentement.", canPass:false, drink:1, ui:"plain", duration:"short" },
	{ id:"ACTION_070", theme:"ACTION", text:"FIN ACTION : applaudissez-vous.", canPass:false, drink:0, ui:"plain", duration:"short" },
],

      
      POLL: [
        { id: "POLL_001", theme: "POLL", text: "Le plus susceptible de draguer à une soirée ?", canPass: false, drink: 1, ui: "poll", duration: "short", options: ["Joueur 1", "Joueur 2", "Joueur 3", "Personne"] },
        { id: "POLL_002", theme: "POLL", text: "Le plus raisonnable… en apparence ?", canPass: false, drink: 1, ui: "poll", duration: "short", options: ["Joueur 1", "Joueur 2", "Joueur 3", "Moi-même"] },
        { id: "POLL_003", theme: "POLL", text: "Le plus dangereux après minuit ?", canPass: false, drink: 1, ui: "poll", duration: "short", options: ["Joueur 1", "Joueur 2", "Joueur 3", "Nous tous"] },
        { id: "POLL_004", theme: "POLL", text: "Qui serait le meilleur menteur ?", canPass: false, drink: 1, ui: "poll", duration: "short", options: ["Joueur 1", "Joueur 2", "Joueur 3", "Franchement…"] },
        { id: "POLL_005", theme: "POLL", text: "Le plus susceptible de finir la bouteille ?", canPass: false, drink: 1, ui: "poll", duration: "short", options: ["Joueur 1", "Joueur 2", "Joueur 3", "La bouteille ? Quelle bouteille ?"] },
	{ id:"POLL_006", theme:"POLL", text:"Le plus susceptible d’envoyer un message qu’il regrettera demain ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Tout le monde"] },
	{ id:"POLL_007", theme:"POLL", text:"Qui ferait le meilleur premier rendez-vous ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Surprise"] },
	{ id:"POLL_008", theme:"POLL", text:"Le plus charismatique ce soir ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","L’ambiance"] },
	{ id:"POLL_009", theme:"POLL", text:"Qui cache le mieux ses intentions ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Personne"] },
	{ id:"POLL_010", theme:"POLL", text:"Le plus susceptible de danser en premier ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Moi"] },
	{ id:"POLL_011", theme:"POLL", text:"Qui serait le meilleur complice pour une bêtise ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","On ne dira pas"] },
	{ id:"POLL_012", theme:"POLL", text:"Le plus difficile à impressionner ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Personne"] },
	{ id:"POLL_013", theme:"POLL", text:"Qui boit avec le plus de style ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Le verre"] },
	{ id:"POLL_014", theme:"POLL", text:"Le plus susceptible de garder un secret ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Ça dépend"] },
	{ id:"POLL_015", theme:"POLL", text:"Qui a clairement changé depuis le début de la soirée ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Tout le monde"] },
	{ id:"POLL_016", theme:"POLL", text:"Le plus à l’aise dans cette pièce ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","L’hôte"] },
	{ id:"POLL_017", theme:"POLL", text:"Qui ferait un excellent alibi ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Personne"] },
	{ id:"POLL_018", theme:"POLL", text:"Le plus mystérieux ce soir ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Impossible à dire"] },
	{ id:"POLL_019", theme:"POLL", text:"Qui a le regard le plus intense ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Le hasard"] },
	{ id:"POLL_020", theme:"POLL", text:"Le plus susceptible de dire « on verra » ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Tout le monde"] },
	{ id:"POLL_021", theme:"POLL", text:"Qui aurait le plus de succès dans une autre ville ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Ici"] },
	{ id:"POLL_022", theme:"POLL", text:"Le plus imprévisible ce soir ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","La soirée"] },
	{ id:"POLL_023", theme:"POLL", text:"Qui pourrait disparaître sans prévenir ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Personne"] },
	{ id:"POLL_024", theme:"POLL", text:"Le plus susceptible de proposer un dernier verre ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Tous"] },
	{ id:"POLL_025", theme:"POLL", text:"Qui écoute vraiment ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Rarement"] },
	{ id:"POLL_026", theme:"POLL", text:"Le plus à l’aise avec le silence ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Personne"] },
	{ id:"POLL_027", theme:"POLL", text:"Qui sait exactement ce qu’il fait ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Personne"] },
	{ id:"POLL_028", theme:"POLL", text:"Le plus susceptible de faire rire sans parler ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","L’expression"] },
	{ id:"POLL_029", theme:"POLL", text:"Qui gère le mieux la pression ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","On verra"] },
	{ id:"POLL_030", theme:"POLL", text:"Le plus élégant ce soir ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Le style"] },
	{ id:"POLL_031", theme:"POLL", text:"Qui irait le plus loin pour gagner ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Personne"] },
	{ id:"POLL_032", theme:"POLL", text:"Le plus détendu ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Maintenant"] },
	{ id:"POLL_033", theme:"POLL", text:"Qui sait quand s’arrêter ?", canPass:false, drink:1, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Pas sûr"] },
	{ id:"POLL_034", theme:"POLL", text:"Le plus susceptible de surprendre encore ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","La nuit"] },
	{ id:"POLL_035", theme:"POLL", text:"Qui a gagné la soirée jusqu’ici ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Le groupe"] },
	{ id:"POLL_036", theme:"POLL", text:"Qui mérite un dernier toast ?", canPass:false, drink:0, ui:"poll", duration:"short", options:["Joueur 1","Joueur 2","Joueur 3","Tout le monde"] },
],

      
      DINGUE: [
        { id: "DINGUE_001", theme: "DINGUE", text: "Si cette soirée était un film, quel serait son genre ?", canPass: true, drink: 0, ui: "plain", duration: "medium" },
        { id: "DINGUE_002", theme: "DINGUE", text: "Quel objet de la pièce deviendra une relique demain ?", canPass: true, drink: 0, ui: "plain", duration: "short" },
        { id: "DINGUE_003", theme: "DINGUE", text: "Qui serait le chef d'une secte improbable ? Pourquoi ?", canPass: true, drink: 0, ui: "plain", duration: "medium" },
        { id: "DINGUE_004", theme: "DINGUE", text: "Si on ouvrait un restaurant inspiré de cette soirée, quelle serait sa spécialité ?", canPass: true, drink: 0, ui: "plain", duration: "medium" },
        { id: "DINGUE_005", theme: "DINGUE", text: "Quel animal représente le mieux l'énergie de la personne à ta gauche ?", canPass: true, drink: 0, ui: "plain", duration: "short" },
	{ id:"DINGUE_006", theme:"DINGUE", text:"Si cette soirée avait une bande-son, quel serait le premier titre ?", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"DINGUE_007", theme:"DINGUE", text:"Qui survivrait le plus longtemps dans une apocalypse totalement absurde ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_008", theme:"DINGUE", text:"Si quelqu’un disparaissait mystérieusement ce soir, qui et pourquoi ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_009", theme:"DINGUE", text:"Quel objet ici pourrait devenir un symbole culte ?", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"DINGUE_010", theme:"DINGUE", text:"Si cette soirée était interdite demain, pour quelle raison ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_011", theme:"DINGUE", text:"Qui serait le plus crédible en gourou du bien-être improbable ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_012", theme:"DINGUE", text:"Si un documentaire était tourné ce soir, quel serait son titre ?", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"DINGUE_013", theme:"DINGUE", text:"Quel détail insignifiant deviendra une anecdote légendaire ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_014", theme:"DINGUE", text:"Qui serait élu président d’un pays imaginaire né ce soir ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_015", theme:"DINGUE", text:"Si cette soirée était une expérience scientifique, que testerait-on ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_016", theme:"DINGUE", text:"Quel serait le slogan officiel de cette nuit ?", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"DINGUE_017", theme:"DINGUE", text:"Qui serait le narrateur d’un film sur cette soirée ?", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"DINGUE_018", theme:"DINGUE", text:"Si un objet pouvait parler, lequel raconterait le plus de choses ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_019", theme:"DINGUE", text:"Quel moment n’a pas encore eu lieu… mais arrivera sûrement ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_020", theme:"DINGUE", text:"Si cette soirée était un animal mythologique, lequel serait-ce ?", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"DINGUE_021", theme:"DINGUE", text:"Qui serait le plus crédible en espion infiltré ce soir ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_022", theme:"DINGUE", text:"Si un objet devait être conservé dans un musée demain, lequel ?", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"DINGUE_023", theme:"DINGUE", text:"Quelle règle absurde pourrait être imposée ici sans raison ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_024", theme:"DINGUE", text:"Si cette soirée avait un effet secondaire étrange, lequel ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_025", theme:"DINGUE", text:"Qui serait le personnage principal d’une légende racontée demain ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_026", theme:"DINGUE", text:"Quel détail pourrait devenir une théorie du complot ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_027", theme:"DINGUE", text:"Si la soirée avait une morale, laquelle serait-elle ?", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"DINGUE_028", theme:"DINGUE", text:"Qui serait le plus crédible dans une version alternative de lui-même ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_029", theme:"DINGUE", text:"Si un objet devait être interdit immédiatement, lequel ?", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"DINGUE_030", theme:"DINGUE", text:"Quel événement imprévisible pourrait encore arriver ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_031", theme:"DINGUE", text:"Si cette soirée devenait un rituel annuel, que faudrait-il toujours refaire ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_032", theme:"DINGUE", text:"Qui serait le plus surpris en revoyant des images demain ?", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"DINGUE_033", theme:"DINGUE", text:"Si un objet gagnait une récompense ce soir, lequel ?", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"DINGUE_034", theme:"DINGUE", text:"Quel moment précis mériterait un ralenti ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_035", theme:"DINGUE", text:"Qui serait le plus crédible dans une version exagérée de lui-même ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_036", theme:"DINGUE", text:"Si cette soirée avait une couleur dominante, laquelle ?", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"DINGUE_037", theme:"DINGUE", text:"Quel objet a déjà trop vécu ce soir ?", canPass:true, drink:0, ui:"plain", duration:"short" },
	{ id:"DINGUE_038", theme:"DINGUE", text:"Si quelqu’un racontait cette soirée en mentant, que changerait-il ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_039", theme:"DINGUE", text:"Quel moment précis sera mal raconté demain ?", canPass:true, drink:0, ui:"plain", duration:"medium" },
	{ id:"DINGUE_040", theme:"DINGUE", text:"FIN DINGUE : Résume cette soirée en un seul mot.", canPass:true, drink:0, ui:"plain", duration:"short" },
],

      
      DICE: [
        { id: "DICE_001", theme: "DICE", text: "Lance le dé de la fortune. Rosas décide.", canPass: true, drink: 0, ui: "dice", duration: "short" },
        { id: "DICE_002", theme: "DICE", text: "Dé de l'élégance : un lancer, et tout le monde obéit.", canPass: true, drink: 0, ui: "dice", duration: "short" },
        { id: "DICE_003", theme: "DICE", text: "Dé 'social' : le hasard choisit qui trinque.", canPass: true, drink: 0, ui: "dice", duration: "short" },
        { id: "DICE_004", theme: "DICE", text: "Dé 'chaos contrôlé' : lance maintenant.", canPass: true, drink: 0, ui: "dice", duration: "short" },
        { id: "DICE_005", theme: "DICE", text: "Dé 'révélateur' : on découvre qui boit… avec style.", canPass: true, drink: 0, ui: "dice", duration: "short" },
        { id: "DICE_006", theme: "DICE", text: "Dé 'destin' : 1 à 6, aucune échappatoire (sauf PASS).", canPass: true, drink: 0, ui: "dice", duration: "short" },
        { id: "DICE_007", theme: "DICE", text: "Dé 'toast' : préparez vos verres.", canPass: true, drink: 0, ui: "dice", duration: "short" },
        { id: "DICE_008", theme: "DICE", text: "Dé 'bisou' : si le 6 tombe, c'est la diplomatie.", canPass: true, drink: 0, ui: "dice", duration: "short" },
        { id: "DICE_009", theme: "DICE", text: "Dé 'soirée' : le hasard met l'ambiance.", canPass: true, drink: 0, ui: "dice", duration: "short" },
        { id: "DICE_010", theme: "DICE", text: "Dé 'Rosas' : lance, et assume la légende.", canPass: true, drink: 0, ui: "dice", duration: "short" },
	{ id:"DICE_011", theme:"DICE", text:"Dé 'regard' : le hasard impose un face-à-face.", canPass:true, drink:0, ui:"dice", duration:"short" },
	{ id:"DICE_012", theme:"DICE", text:"Dé 'distribution' : Rosas répartit les gorgées.", canPass:true, drink:0, ui:"dice", duration:"short" },
	{ id:"DICE_013", theme:"DICE", text:"Dé 'silence' : le dé choisit qui se tait.", canPass:true, drink:0, ui:"dice", duration:"short" },
	{ id:"DICE_014", theme:"DICE", text:"Dé 'double effet' : ce n’est jamais neutre.", canPass:true, drink:0, ui:"dice", duration:"short" },
	{ id:"DICE_015", theme:"DICE", text:"Dé 'immunité ou boisson' : le sort tranche.", canPass:true, drink:0, ui:"dice", duration:"short" },
	{ id:"DICE_016", theme:"DICE", text:"Dé 'désignation' : quelqu’un est choisi par le hasard.", canPass:true, drink:0, ui:"dice", duration:"short" },
	{ id:"DICE_017", theme:"DICE", text:"Dé 'rythme' : le tempo de la soirée change.", canPass:true, drink:0, ui:"dice", duration:"short" },
	{ id:"DICE_018", theme:"DICE", text:"Dé 'regle éclair' : une mini-règle apparaît.", canPass:true, drink:0, ui:"dice", duration:"short" },
	{ id:"DICE_019", theme:"DICE", text:"Dé 'social' : le hasard crée un duo.", canPass:true, drink:0, ui:"dice", duration:"short" },
	{ id:"DICE_020", theme:"DICE", text:"Dé 'toast collectif' : selon le chiffre, on trinque.", canPass:true, drink:0, ui:"dice", duration:"short" },
	{ id:"DICE_021", theme:"DICE", text:"Dé 'pression douce' : quelqu’un est sous les projecteurs.", canPass:true, drink:0, ui:"dice", duration:"short" },
	{ id:"DICE_022", theme:"DICE", text:"Dé 'cadeau empoisonné' : le chiffre décide qui choisit.", canPass:true, drink:0, ui:"dice", duration:"short" },
	{ id:"DICE_023", theme:"DICE", text:"Dé 'chance insolente' : soit tu gagnes, soit tu offres.", canPass:true, drink:0, ui:"dice", duration:"short" },
	{ id:"DICE_024", theme:"DICE", text:"FIN DICE : Rosas tranche une dernière fois.", canPass:true, drink:0, ui:"dice", duration:"short" },
],

      
      PHOTO: [
        { id: "PHOTO_001", theme: "PHOTO", text: "Photo de groupe : tout le monde doit avoir la même expression (choisie par le joueur).", canPass: true, drink: 0, ui: "photo", duration: "medium" },
        { id: "PHOTO_002", theme: "PHOTO", text: "Selfie duo : toi + la personne à ta gauche, version 'couverture de magazine'.", canPass: true, drink: 0, ui: "photo", duration: "medium" },
        { id: "PHOTO_003", theme: "PHOTO", text: "Photo 'objet star' : prends en photo l'objet le plus chic de la pièce. Pose dramatique autorisée.", canPass: true, drink: 0, ui: "photo", duration: "medium" },
        { id: "PHOTO_004", theme: "PHOTO", text: "Photo 'avant minuit' : capture la meilleure énergie du moment (même si c'est le snack).", canPass: true, drink: 0, ui: "photo", duration: "medium" },
        { id: "PHOTO_005", theme: "PHOTO", text: "Photo 'catwalk' : mini défilé. Quelqu'un prend la photo pendant que tu poses.", canPass: true, drink: 0, ui: "photo", duration: "medium" },
        { id: "PHOTO_006", theme: "PHOTO", text: "Photo 'publicité' : faites une pub pour… un verre d'eau. (Oui, ça compte.)", canPass: true, drink: 0, ui: "photo", duration: "medium" },
        { id: "PHOTO_007", theme: "PHOTO", text: "Photo 'team' : 4 personnes dans le cadre, toutes avec une pose différente. Plus c'est absurde, mieux c'est.", canPass: true, drink: 0, ui: "photo", duration: "medium" },
        { id: "PHOTO_008", theme: "PHOTO", text: "Photo 'mains' : photo artistique des mains qui trinquent (zoom + style).", canPass: true, drink: 0, ui: "photo", duration: "medium" },
        { id: "PHOTO_009", theme: "PHOTO", text: "Photo 'sérieux' : tout le monde fait semblant d'être très important pendant 3 secondes. Clic.", canPass: true, drink: 0, ui: "photo", duration: "medium" },
        { id: "PHOTO_010", theme: "PHOTO", text: "Photo 'le moment' : capture un vrai moment (rire, surprise, toast). Pas de pose obligatoire.", canPass: true, drink: 0, ui: "photo", duration: "medium" },
	{ id:"PHOTO_011", theme:"PHOTO", text:"Photo 'regard' : deux personnes se regardent sérieusement, le reste du groupe fait n’importe quoi derrière.", canPass:true, drink:0, ui:"photo", duration:"medium" },
	{ id:"PHOTO_012", theme:"PHOTO", text:"Photo 'cinéma' : recréez une scène de film culte… sans parler.", canPass:true, drink:0, ui:"photo", duration:"medium" },
	{ id:"PHOTO_013", theme:"PHOTO", text:"Photo 'après la fête' : chacun prend une pose comme s’il était 6h du matin.", canPass:true, drink:0, ui:"photo", duration:"medium" },
	{ id:"PHOTO_014", theme:"PHOTO", text:"Photo 'élite' : tout le monde adopte une posture ultra chic pendant 3 secondes.", canPass:true, drink:0, ui:"photo", duration:"medium" },
	{ id:"PHOTO_015", theme:"PHOTO", text:"Photo 'contraste' : une personne très sérieuse, une personne très expressive.", canPass:true, drink:0, ui:"photo", duration:"medium" },
	{ id:"PHOTO_016", theme:"PHOTO", text:"Photo 'triangle' : trois personnes, trois attitudes totalement différentes.", canPass:true, drink:0, ui:"photo", duration:"medium" },
	{ id:"PHOTO_017", theme:"PHOTO", text:"Photo 'coulisses' : capturez un moment entre deux actions du jeu.", canPass:true, drink:0, ui:"photo", duration:"medium" },
	{ id:"PHOTO_018", theme:"PHOTO", text:"Photo 'groupe serré' : tout le monde doit rentrer dans le cadre, coûte que coûte.", canPass:true, drink:0, ui:"photo", duration:"medium" },
	{ id:"PHOTO_019", theme:"PHOTO", text:"Photo 'pose libre' : chacun choisit sa pose sans regarder les autres.", canPass:true, drink:0, ui:"photo", duration:"medium" },
	{ id:"PHOTO_020", theme:"PHOTO", text:"Photo 'regard caméra' : tout le monde regarde l’objectif comme s’il savait quelque chose.", canPass:true, drink:0, ui:"photo", duration:"medium" },
	{ id:"PHOTO_021", theme:"PHOTO", text:"Photo 'miroir' : si possible, photo avec un reflet (miroir, vitre, surface brillante).", canPass:true, drink:0, ui:"photo", duration:"medium" },
	{ id:"PHOTO_022", theme:"PHOTO", text:"Photo 'désordre organisé' : capturez le joyeux bazar de la soirée avec style.", canPass:true, drink:0, ui:"photo", duration:"medium" },
	{ id:"PHOTO_023", theme:"PHOTO", text:"Photo 'presque sérieuse' : tout le monde essaie d’être sérieux… presque.", canPass:true, drink:0, ui:"photo", duration:"medium" },
	{ id:"PHOTO_024", theme:"PHOTO", text:"FIN PHOTO : photo de groupe finale. Pas de pose imposée. Juste le moment.", canPass:true, drink:0, ui:"photo", duration:"medium" },
 ],

      
      NEVER: [
	{ id:"NEVER_001", theme:"NEVER", text:"Je n’ai jamais… fumé de joints.", canPass:true, drink:1, ui:"never", duration:"short" },
	{ id:"NEVER_002", theme:"NEVER", text:"Je n’ai jamais… marché dans la rue presque nu(e).", canPass:true, drink:1, ui:"never", duration:"short" },
	{ id:"NEVER_003", theme:"NEVER", text:"Je n’ai jamais… fait l’amour dans les bois.", canPass:true, drink:1, ui:"never", duration:"medium" },
	{ id:"NEVER_004", theme:"NEVER", text:"Je n’ai jamais… dormi devant ma porte après une cuite.", canPass:true, drink:1, ui:"never", duration:"medium" },
	{ id:"NEVER_005", theme:"NEVER", text:"Je n’ai jamais… vomi dans un endroit vraiment inadapté.", canPass:true, drink:1, ui:"never", duration:"short" },
	{ id:"NEVER_006", theme:"NEVER", text:"Je n’ai jamais… oublié totalement comment je suis rentré(e).", canPass:true, drink:1, ui:"never", duration:"medium" },
	{ id:"NEVER_007", theme:"NEVER", text:"Je n’ai jamais… embrassé quelqu’un juste parce que c’était là.", canPass:true, drink:1, ui:"never", duration:"short" },
	{ id:"NEVER_008", theme:"NEVER", text:"Je n’ai jamais… pris une décision majeure complètement bourré(e).", canPass:true, drink:1, ui:"never", duration:"medium" },
	{ id:"NEVER_009", theme:"NEVER", text:"Je n’ai jamais… menti sur mon état d’alcoolémie.", canPass:true, drink:1, ui:"never", duration:"short" },
	{ id:"NEVER_010", theme:"NEVER", text:"Je n’ai jamais… fait semblant d’être sobre face à quelqu’un d’important.", canPass:true, drink:1, ui:"never", duration:"medium" },
	{ id:"NEVER_011", theme:"NEVER", text:"Je n’ai jamais… dit « je gère » alors que clairement non.", canPass:true, drink:1, ui:"never", duration:"short" },
	{ id:"NEVER_012", theme:"NEVER", text:"Je n’ai jamais… dépassé une limite que je m’étais juré de ne jamais franchir.", canPass:true, drink:1, ui:"never", duration:"medium" },
	{ id:"NEVER_013", theme:"NEVER", text:"Je n’ai jamais… été réveillé(e) dans un endroit absurde.", canPass:true, drink:1, ui:"never", duration:"medium" },
	{ id:"NEVER_014", theme:"NEVER", text:"Je n’ai jamais… mangé n'importe quoi d'inadapté sous l'effet de l'alcool.", canPass:true, drink:1, ui:"never", duration:"short" },
	{ id:"NEVER_015", theme:"NEVER", text:"Je n’ai jamais… fait quelque chose d’illégal « juste pour voir ».", canPass:true, drink:1, ui:"never", duration:"medium" },
	{ id:"NEVER_016", theme:"NEVER", text:"Je n’ai jamais… pensé « tant pis pour demain ».", canPass:true, drink:1, ui:"never", duration:"short" },
	{ id:"NEVER_017", theme:"NEVER", text:"Je n’ai jamais… dit « plus jamais » et recommencé la semaine suivante.", canPass:true, drink:1, ui:"never", duration:"short" },
	{ id:"NEVER_018", theme:"NEVER", text:"Je n’ai jamais… été surpris(e) d’être encore debout.", canPass:true, drink:1, ui:"never", duration:"short" },
	{ id:"NEVER_019", theme:"NEVER", text:"Je n’ai jamais… fait une connerie en pensant que personne ne regardait.", canPass:true, drink:1, ui:"never", duration:"medium" },
	{ id:"NEVER_020", theme:"NEVER", text:"Je n’ai jamais… mangé mes crottes de nez.", canPass:true, drink:1, ui:"never", duration:"medium" },
	{ id:"NEVER_021", theme:"NEVER", text:"Je n’ai jamais… sous-estimé la quantité d’alcool nécessaire pour foutre le bordel.", canPass:true, drink:1, ui:"never", duration:"short" },
	{ id:"NEVER_022", theme:"NEVER", text:"Je n’ai jamais… fait croire que c'était la personne d'à côté qui avait pété.", canPass:true, drink:1, ui:"never", duration:"medium" },
	{ id:"NEVER_023", theme:"NEVER", text:"Je n’ai jamais… regretté d’avoir joué à ce jeu.", canPass:true, drink:1, ui:"never", duration:"short" },
	{ id:"NEVER_024", theme:"NEVER", text:"FIN NEVER : Je n’ai jamais… su que cette carte ferait boire autant de monde.", canPass:true, drink:1, ui:"never", duration:"short" }
],

      
      RULE: [
	{ id:"RULE_001", theme:"RULE", text:"Nouvelle règle : pendant 3 tours, tu dois parler avec un accent ridicule choisi par le groupe.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Accent imposé pendant 3 tours" },
	{ id:"RULE_002", theme:"RULE", text:"Nouvelle règle : interdiction totale de dire « non » pendant 2 tours. Chaque oubli = 1 gorgée.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Interdiction de dire non" },
	{ id:"RULE_003", theme:"RULE", text:"Nouvelle règle : chaque fois que quelqu’un dit « santé », il/elle boit 2.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Dire santé = boire 2" },
	{ id:"RULE_004", theme:"RULE", text:"Nouvelle règle : tu dois appeler tout le monde par un surnom gênant choisi au hasard.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Surnoms gênants obligatoires" },
	{ id:"RULE_005", theme:"RULE", text:"Nouvelle règle : chaque fou rire = 1 gorgée immédiate.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Rire = boire" },
	{ id:"RULE_006", theme:"RULE", text:"Nouvelle règle : interdiction de dire « je » pendant 3 tours. Chaque erreur = 1 gorgée.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Interdiction de dire je" },
	{ id:"RULE_007", theme:"RULE", text:"Nouvelle règle : tu dois trinquer avec quelqu’un avant chaque gorgée.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Boire = trinquer" },
	{ id:"RULE_008", theme:"RULE", text:"Nouvelle règle : parler en chuchotant jusqu’à ton prochain tour.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Chuchotement obligatoire" },
	{ id:"RULE_009", theme:"RULE", text:"Nouvelle règle : chaque fois que tu bois, regarde quelqu’un droit dans les yeux.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Boire = regard intense" },
	{ id:"RULE_010", theme:"RULE", text:"Nouvelle règle : interdiction de croiser les bras. Oubli = 1 gorgée.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Bras décroisés obligatoires" },
	{ id:"RULE_011", theme:"RULE", text:"Nouvelle règle : tu dois commenter à voix haute chaque gorgée que tu prends.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Boire = commentaire obligatoire" },
	{ id:"RULE_012", theme:"RULE", text:"Nouvelle règle : chaque fois que quelqu’un boit, tu dois l’encourager.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Boire = encouragement" },
	{ id:"RULE_013", theme:"RULE", text:"Nouvelle règle : interdiction de poser des questions pendant 2 tours.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Interdiction de poser des questions" },
	{ id:"RULE_014", theme:"RULE", text:"Nouvelle règle : tu dois lever ton verre dès que quelqu’un parle trop.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Parler trop = verre levé" },
	{ id:"RULE_015", theme:"RULE", text:"Nouvelle règle : chaque silence gênant = tout le monde boit 1.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Silence gênant = boire" },
	{ id:"RULE_016", theme:"RULE", text:"Nouvelle règle : interdiction de regarder ton téléphone pendant 3 tours.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Téléphone interdit" },
	{ id:"RULE_017", theme:"RULE", text:"Nouvelle règle : tu dois imiter quelqu’un avant chaque prise de parole.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Parler = imitation" },
	{ id:"RULE_018", theme:"RULE", text:"Nouvelle règle : chaque fois que tu dis le prénom de quelqu’un, bois 1.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Dire un prénom = boire" },
	{ id:"RULE_019", theme:"RULE", text:"Nouvelle règle : tu dois annoncer à voix haute chaque règle que tu enfreins.", canPass:false, drink:1, ui:"rule", duration:"short", rule:"Infraction annoncée" },
	{ id:"RULE_020", theme:"RULE", text:"FIN RULE : Toutes les règles sautent… sauf celles que le groupe garde.", canPass:false, drink:0, ui:"rule", duration:"short", rule:"Le groupe choisit les règles restantes" }
]
    };

  // ============================================================
  // INTERNAL STATE
  // ============================================================
  let players = []; // prénoms actuels (optionnel)
  let availableCards = {};
  let usedCards = {};

  // Fisher–Yates (mélange non biaisé)
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function sanitizePlayers(list) {
    if (!Array.isArray(list)) return [];
    const clean = list
      .map((s) => String(s || "").trim())
      .filter(Boolean)
      .slice(0, 8);
    // Uniques (évite doublons)
    return [...new Set(clean)];
  }

  function rebuildDecks() {
    availableCards = {};
    usedCards = {};
    for (const themeKey of Object.keys(CARDS_DATABASE)) {
      availableCards[themeKey] = deepClone(CARDS_DATABASE[themeKey]);
      usedCards[themeKey] = [];
      shuffleArray(availableCards[themeKey]);
    }
  }

  function ensureTheme(themeKey) {
    if (!CARDS_DATABASE[themeKey]) {
      throw new Error(`Thème inconnu: ${themeKey}`);
    }
  }

  function fillPollOptions(card) {
    // Si pas de poll/designate => rien
    if (!card || (card.ui !== "poll" && card.ui !== "designate")) return card;

    // Si on a des joueurs, on remplace "Joueur 1/2/3" par des noms réels
    if (players.length > 0 && Array.isArray(card.options) && card.options.length > 0) {
      const mapped = card.options.map((opt, idx) => {
        const isPlaceholder = /^Joueur\s*\d+$/i.test(String(opt).trim());
        if (isPlaceholder) return players[idx % players.length];
        return opt;
      });
      return { ...card, options: mapped };
    }

    // Si pas d'options => on en fabrique
    if (card.ui === "poll" && (!Array.isArray(card.options) || card.options.length === 0)) {
      const fallback = players.length
        ? players.slice(0, 4)
        : ["Joueur 1", "Joueur 2", "Joueur 3", "Personne"];
      return { ...card, options: fallback };
    }

    return card;
  }

  // ============================================================
  // PUBLIC API
  // ============================================================
  function init(playerList = []) {
    players = sanitizePlayers(playerList);
    rebuildDecks();
    return true;
  }

  function draw(themeKey) {
    ensureTheme(themeKey);

    // Recycle si vide
    if (!availableCards[themeKey] || availableCards[themeKey].length === 0) {
      availableCards[themeKey] = usedCards[themeKey] || [];
      usedCards[themeKey] = [];
      shuffleArray(availableCards[themeKey]);
    }

    const card = availableCards[themeKey].pop();
    if (!card) return null;

    usedCards[themeKey].push(card);

    // inject options poll avec joueurs
    return fillPollOptions(card);
  }

  function stats() {
    const totalCards = Object.values(CARDS_DATABASE).reduce((sum, cards) => sum + cards.length, 0);
    const usedTotal = Object.values(usedCards).reduce((sum, cards) => sum + (cards?.length || 0), 0);
    const remainingTotal = Object.values(availableCards).reduce((sum, cards) => sum + (cards?.length || 0), 0);
    const progress = totalCards > 0 ? Math.round((usedTotal / totalCards) * 100) : 0;

    return {
      totalCards,
      usedCards: usedTotal,
      remainingCards: remainingTotal,
      progress,
    };
  }

  function themes() {
    return deepClone(THEMES);
  }

  function reset() {
    rebuildDecks();
    return true;
  }

  // ============================================================
  // Boot (compatible avec ton ancien code)
  // ============================================================
  init([]);

  // Expose global (simple pour ton app.js)
  window.RosasCards = Object.freeze({
    init,
    draw,
    stats,
    themes,
    reset,
    // utile debug
    _db: CARDS_DATABASE,
  });

  console.log("✅ cards.js chargé (RosasCards prêt)");
})();