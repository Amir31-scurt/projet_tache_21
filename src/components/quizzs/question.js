export const quizzes = [
    {
      title: "HTML/CSS",
      description: "Testez votre niveau en HTML/CSS",
      questions: [
        {
          question: "Que signifie HTML ?",
          answers: [
            "Home Tool Markup Language",
            "HyperLinks and Text Markup Language",
            "Hyper Text Markup Language",
            
          ],
        },

        {
          question: "Choisissez le bon élément HTML pour le titre le plus grand :",
          answers: [
            "<h6>",
            "<Head>",
            "<h1>",
          ],
        },

        {
          question: "Quel est l'élément HTML correct pour insérer un saut de ligne ?",
          answers: [
            "<br>",
            "<break>",
            "<lb>",
          ],
        },

        {
          question: "Quel est le HTML correct pour ajouter une couleur d’arrière-plan ?",
          answers: [
            "<body style='background-color: yellow'>",
            "<backgroung>Yellow</backgound>",
            "<body bg = 'yellow'>",
          ],
        },
        {
          question: "Comment pouvons-nous corriger la largeur du conteneur dans Bootstrap ?",
          answers: [
            "conteneur-par défaut",
            "récipient",
            "conteneur-fixe",
            "conteneur-fluide",
          ],
        },
        {
          question: "Laquelle des classes d'amorçage ci-dessous est utilisée pour convertir une image en cercle ?",
          answers: [
            "img-arrondi",
            "img-cercle",
            "Aucune des réponses ci-dessus",
          ],
        },

        {
          question: "Quel plugin est utilisé pour créer un cycle d'éléments sous forme de diaporama ?",
          answers: [
            "Diaporama",
            "espion parchemin",
            "Carrousel",
            "Aucune des réponses ci-dessus",
          ],
        },

        {
          question: "Quelles classes bootstrap sont utilisées pour ajouter une bande zébrée au tableau ?",
          answers: [
            "tab-rayé",
            "Zebra-strip",
            "table-depouillé",
            "table-rayé",
          ],
        },

        {
          question: "Laquelle des classes suivantes dans Bootstrap est utilisée pour créer un groupe de listes de base ?",
          answers: [
            "List-groupée",
            "Select-list",
            "List-group",
            "Liste-groupé",
          ],
        },

        {
          question: "Laquelle des classes bootstrap ci-dessous est utilisée pour créer la grande boîte dans bootstrap ?",
          answers: [
            "boîte",
            "récipient",
            "conteneur-fuild",
            "jumbotron",
          ],
        },
        // Add more questions and answers as needed
      ],
    },
    {
      title: "JavaScript",
      description: "Testez votre niveau en JavaScript",
      questions: [
        {
          question: "Dans quel élément HTML mettons-nous le JavaScript ?",
          answers: [
            "<scriping>",
             "<js>",
              "<script>",
              "<javascript>"
            ],
        },

        {
          question: "Quel est le bon endroit pour insérer un JavaScript ?",
          answers: [
            "The <body> section",
             "The <head> section",
              "Both the <head> section and the <body> section are correct ",
            ],
        },

        {
          question: "Quelle est la syntaxe correcte pour faire référence à un script externe appelé « xxx.js » ?",
          answers: [
            "<script href ='xxx.js'>",
             "<script name ='xxx.js'>",
              "<script src ='xxx.js'> ",
            ],
        },

        {
          question: "Comment écrire « Hello World » dans une boîte d'alerte ?",
          answers: [
            "alert('Hello Word')",
             "msg('Hello Word')",
             "msgBox('Hello Word')",
             "alertBox('Hello Word')",
            ],
        },

        {
          question: "Comment créer une fonction en JavaScript ?",
          answers: [
            "function:myFunction()",
             "function myFunction()",
             "function = myFunction()",
            ],
        },

        {
          question: "React est principalement utilisé pour construire ___",
          answers: [
            "Base de données",
             "Connectivité",
             "Interface d'utilisateur",
             "Plateforme de conception",
            ],
        },

        {
          question: "____ peut être effectué alors que plusieurs composants doivent être renvoyés par un composant.",
          answers: [
            "Abstraction",
             "Packing",
             "Isolation(Insulation)",
             "Emballage(Wrapping)",
            ],
        },

        {
          question: "Quel hook React utilisez-vous pour effectuer des effets secondaires dans un composant fonctionnel ?",
          answers: [
            "useEffect()",
             "useLifeCycle()",
             "componentDidMount()",
  
            ],
        },

        {
          question: "Qu'est-ce qui se passe lorsqu'on appelle setState() à l'intérieure de la méthode render()?",
          answers: [
            "Une sortie répétitive apparaît sur l'écran",
             "Erreur de clé en double",
             "Erreur de stack overflow",
             "Rien",
            ],
        },

        {
          question: "Qu'est-ce que c'est 'state' en React?",
          answers: [
            "Un stockage persistent",
             "Un magasin de données interne (objet) d'un composant.",
            ],
        },
        // Add more questions and answers as needed
      ],
    },
    {
      title: "PHP",
      description: "Testez votre niveau en PHP",
      questions: [
        {
          question: "Quelle syntaxe permet de supprimer l'élément avec la clé 2 du tableau $tableau ?",
          answers: [
             "unset($tableau[2])",
             "remove($tableau[2])",
              "delete($tableau{2})",
              "delete($tableau[2])"
            ],
        },

        {
          question: " Quelle syntaxe utiliser pour commenter une seule ligne en PHP ?",
          answers: [
              "// Commentaire en PHP",
              "?? Commentaire en PHP",
              "%% Commentaire en PHP",
              "$$ Commentaire en PHP"
            ],
        },

        {
          question: " Parmi les variables suivantes, laquelle a un nom invalide ?",
          answers: [
              "$1variable",
              "$variable1",
              "$_mavariable",
              "$mavariable"
            ],
        },

        {
          question: "Quel est l'extension d'un fichier PHP ?",
          answers: [
            "pp",
             "php",
              "php5",
              "html"
            ],
        },

        {
          question: "Quelles sont les valeurs possibles pour une variable de type booléen ?",
          answers: [
            "0 ou 1",
             "TRUE or FALSE",
              "Une infinité de possibilité",
              "Tout sauf NULL"
            ],
        },

        {
          question: "Quelle commande est utilisée pour démarrer le serveur Laravel ?",
          answers: [
            "php artisan serve",
             "php artisan start php",
              "php artisan start php",
              "artisan start-server"
            ],
        },

        {
          question: " Comment créer un contrôleur dans Laravel avec CMD ?",
          answers: [
            "php artisan make: generate controller mycontoller",
             "php artisan make:controller generate",
              "php artisan make:request mycontoller create",
              "php artisan make:controller --plain"
            ],
        },

        {
          question: " Quelle commande est de Laravel ?",
          answers: [
            "git",
             "composer",
              "php artisan",
              "php -v"
            ],
        },

        {
          question: " Qu’est-ce que Laravel ?",
          answers: [
            " Langage de programmation",
             "Framework PHP",
              "Générateur de code",
              "Aucun des éléments ci-dessus"
            ],
        },

        {
          question: " Qui a développé Laravel ?",
          answers: [
            " Linus Torvalds",
             "Taylor Otwell",
              "James Gosling",
              "Guido van Rossum"
            ],
        },
        // Add more questions and answers as needed
      ],
    },
    {
      title: "PYTHON",
      description: "Testez votre niveau en PYTHON",
      questions: [
        {
          question: "Comment définissez-vous une boucle for en Python ?",
          answers: [
            "for i in range(10):",
             "for i = 0; i < 10; i++:",
              "foreach i in range(10):"
            ],
        },

        {
          question: "Comment utilisez-vous le module unittest pour écrire des tests unitaires en Python ?",
          answers: [
            "testcase.py",
             "test.py",
              "unittest.py"],
        },

        {
          question: "Comment vérifiez-vous la présence d'une clé dans un dictionnaire ?",
          answers: [
            "key in dictionary",
             "dictionary.contains(key)",
              "dictionary[key] != None"],
        },

        {
          question: "Comment divisez-vous une chaîne de caractères en une liste de mots ?",
          answers: [
            "str.split()",
             "str.divide()",
              "str.splitter()"
            ],
        },

        {
          question: "Quelle méthode pouvez-vous utiliser pour convertir une chaîne en majuscules ?",
          answers: [
            "str.upper()",
             "str.capitalize()",
              "str.toUpper()"
            ],
        },

        {
          question: "Quelle commande utilisez-vous pour créer une migration en Django ?",
          answers: [
            "python manage.py migrate",
             " python manage.py make:migration",
              "python manage.py create:migration"
            ],
        },

        {
          question: "Quel est le rôle de middleware dans Django ?",
          answers: [
            "Gérer les fichiers statiques.",
             "Fournir une interface d'administration.",
              "Traiter les requêtes avant qu'elles n'atteignent la vue."
            ],
        },

        {
          question: "Comment utilisez-vous Django signals ?",
          answers: [
            " Pour envoyer des signaux radio depuis l'application",
             "Pour créer des signaux lumineux dans l'interface utilisateur.",
              "Pour effectuer des actions en réponse à certaines opérations, telles que la création d'un utilisateur."
            ],
        },

        {
          question: "Quel est le rôle du fichier urls.py dans un projet Django ?",
          answers: [
            " Définit les modèles de données",
             "Gère les URLs des applications.",
              "c) python manage.py create:migration"
            ],
        },

        {
          question: "Comment référencez-vous un fichier statique dans un fichier de modèle Django ?",
          answers: [
            " {% static 'file.css' %}",
             "{% media 'file.css' %}",
              "{% file 'file.css' %}"
            ],
        },
        // Add more questions and answers as needed
      ],
    },
    // Add more quizzes as needed
  ];