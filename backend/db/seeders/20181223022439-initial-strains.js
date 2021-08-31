"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Strains",
      [
        {
          name: "Cinex",
          type: "Hybrid",
          description:
            "A hybrid of Cinderella 99 and Vortex, Cinex smells of sweet citrus, and earthy skunk with a clear-headed and uplifting effect. Great for building a positive mindset and stimulating creative energy.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 3, 15, 18],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Durban Poison",
          type: "Sativa",
          description:
            "Durban Poison is a pure African sativa, renown for its sweet, pine smell, and energetic and uplifting effects; perfect to help you stay productive or lend a spark of creativity.  ",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 3, 15, 19],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Silver Haze",
          type: "Sativa",
          description:
            "Silver Haze is a cross between Haze and a non-indica dominant phenotype of Northern Lights. It maintains a strong but clear-headed sativa effect and has a pungent, earthy, citrus flavor and aroma. ",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 3, 15, 20],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Lemon Kush",
          type: "Hybrid",
          description:
            "Proper Lemon Kush should have a sweet lemon and citrus flavor with earthy kush undertones and provide an uplifting and creative mental mood shift.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 3, 17, 18],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Purple Wreck",
          type: "Hybrid",
          description:
            "Purple Wreck is the offspring of Purple Urkle and Trainwreck, and smells sweet and grassy with a hint of grapes and citrus.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 3, 17, 19],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Alien Stardawg",
          type: "Sativa",
          description:
            "A cross between Alien Kush and Stardawg, this Sativa dominant hybrid delivers a hash and chemical/fuel smell, and a well rounded high.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 3, 17, 20],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Master Kush",
          type: "Indica",
          description:
            "Master Kush produces a subtle, earthy, citrus smell with a hint of incense. The taste is hash-like and provides full body relaxation without the mind-numbing effects that many indicas produce.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 3, 16, 18],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Holy Grail Kush",
          type: "Hybrid",
          description:
            "The offspring of OG #18 and Kosher Kush, Holy Grail Kush produces a mellow relaxation and smells like Kush with a strong spicy, citrus smell.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 3, 16, 19],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Cotton Candy Kush",
          type: "Hybrid",
          description:
            "Cotton Candy is a cross between the Lavender and Power Plant strains, and has a pungent, sweet, berry and floral scent. The effects of this strain will leave you feeling euphoric and relaxed and keep your stress and pain to a minimum.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 3, 16, 20],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "AK-48",
          type: "Hybrid",
          description:
            "AK-48 combines Colombian Gold, Thai, Mexican, and Afghani strains for an earthy, citrus flavor, and will help you get those creative juices flowing.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 4, 15, 18],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "American Dream",
          type: "Hybrid",
          description:
            "American Dream is a strain that blends Afghan Skunk with Jamaican and Hawaiian genetics. Earthy and skunky in flavor, American Dream brings a sense of happyness, with a balanced uplifting, social effect. ",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 4, 15, 19],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Jillybean",
          type: "Hybrid",
          description:
            "Jillybean has been described as an upbeat and happy hybrid with tangy orange and mango flavors. Great for the creative minds and social butterflies looking for an unencumbered euphoria during the day.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 4, 15, 20],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Lemon Kush",
          type: "Hybrid",
          description:
            "Proper Lemon Kush should have a sweet lemon and citrus flavor with earthy kush undertones and provide an uplifting and creative mental mood shift.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 4, 17, 18],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Purple Wreck",
          type: "Hybrid",
          description:
            "Purple Wreck is the offspring of Purple Urkle and Trainwreck, and smells sweet and grassy with a hint of grapes and citrus.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 4, 17, 19],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Bandana",
          type: "Hybrid",
          description:
            "Bandana is a cross of Banana OG and 707 Headband, and has a sweet banana aroma and a nice cerebral sensation with a powerful, heady euphoria and deep blissful relaxation. ",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 4, 17, 20],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Master Kush",
          type: "Indica",
          description:
            "Master Kush produces a subtle, earthy, citrus smell with a hint of incense. The taste is hash-like and provides full body relaxation without the mind-numbing effects that many indicas produce.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 4, 16, 18],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "5th Element",
          type: "Indica",
          description:
            "5th Element crosses Blackberry with All Spark OG to produce a powerful, earthy, lemony smell and flavor with a strong and long lasting blend of cerebral and body high.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 4, 16, 19],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Cotton Candy Kush",
          type: "Hybrid",
          description:
            "Cotton Candy is a cross between the Lavender and Power Plant strains, and has a pungent, sweet, berry and floral scent. The effects of this strain will leave you feeling euphoric and relaxed and keep your stress and pain to a minimum.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 4, 16, 20],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Sour Diesel",
          type: "Sativa",
          description:
            "Sour Diesel is named after its pungent, fuel-like aroma and has and energizing, dreamy cerebral effect",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 5, 15, 18],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Green Crack",
          type: "Sativa",
          description:
            "Green Crack is an amazing daytime strain with a fruity, mango flavor that provides sharp energy and focus, and an invigorating metal buzz. ",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 5, 15, 19],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "White Fire OG",
          type: "Hybrid",
          description:
            'Sometimes referred to as "WiFi OG", this sativa-dominant hybrid delivers an uplifting yet comfortable cerebrally focused effect with a sour, earthy, diesel aroma.',
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 5, 15, 20],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Lemon Kush",
          type: "Hybrid",
          description:
            "Proper Lemon Kush should have a sweet lemon and citrus flavor with earthy kush undertones and provide an uplifting and creative mental mood shift.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 5, 17, 18],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Purple Wreck",
          type: "Hybrid",
          description:
            "Purple Wreck is the offspring of Purple Urkle and Trainwreck, and smells sweet and grassy with a hint of grapes and citrus.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 5, 17, 19],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Double Dutch",
          type: "Sativa",
          description:
            "Double Dutch is a potent cross between a pre-2000 Chronic female with a Warlock male. The result is an aroma that smells of fresh fruit and wild flowers, and powerful relaxation for the body and mind without too much drowsiness. ",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 5, 17, 20],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Cali Gold",
          type: "Hybrid",
          description:
            "Cali Gold has a pungent, earthy smell with citrus notes,reminiscent of lemongrass. Effects tend to be body relaxing but not completely sedative.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 5, 16, 18],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "5th Element",
          type: "Indica",
          description:
            "5th Element crosses Blackberry with All Spark OG to produce a powerful, earthy, lemony smell and flavor with a strong and long lasting blend of cerebral and body high.",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 5, 16, 19],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Blue Heron",
          type: "Hybrid",
          description:
            "Blue Heron is an indica-dominant hybrid that crosses the Blue Magoo and Huckleberry strains. It has a blueberry, rose, and citrus aroma; and will leaving you feeling uplifted and yet serene. ",
          imgSrc: "/images/cannabis.jpg",
          choices: [1, 5, 16, 20],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Blue Dream",
          type: "Hybrid",
          description:
            "Blue Dream has a sweet, berry aroma; and provides  calming, full-body relaxation with gentle cerebral invigoration.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 6, 9, 12],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Mango Kush",
          type: "Hybrid",
          description:
            "Mango Kush actually tastes like mangos combined with that sweet, piney flavor that most Kush strains have. It provides a wonderful blend of mental and physical relaxation.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 6, 9, 13],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Afghan Kush",
          type: "Indica",
          description:
            "Afghan Kush has that classic earthy, woody Kush taste and is revered for its heavy resin content and powerfully sedating effects.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 6, 9, 14],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Chemdawg",
          type: "Hybrid",
          description:
            "Chemdawg is known for its distinct and pungent, diesel-like aroma and provides a very cerebral experience, coupled with a strong heavy-bodied feeling.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 6, 10, 12],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Fire OG",
          type: "Hybrid",
          description:
            'Known for being one of the strongest of the "OG" strains, Fire OG smells similar to Lemon Pledge with a touch of pine, and the effects can last up to 3 hours.',
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 6, 10, 13],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Bubba Kush",
          type: "Indica",
          description:
            "Bubba Kush exhibits a sweet hashish flavor with subtle notes of chocolate and coffee that usher in powerful relaxation and muscle ease with a blanket of dreamy euphoria",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 6, 10, 14],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Bubble Gum",
          type: "Hybrid",
          description:
            "Bubble Gum has the characteristic smell of its namesake and a euphoric high great for stimulating creativity.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 6, 11, 12],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Cheese",
          type: "Hybrid",
          description:
            "Named for its sharply sour aroma, Cheese is well-known for its relaxing, happy effects that gently easy you into a blissful state of mind.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 6, 11, 13],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Hindu Kush",
          type: "Indica",
          description:
            "Hindu Kush is named after the mountain range extending 500 miles between Pakistan and Afghanistan; and has a sweet and earthy sandalwood-like aroma. This strain induces a deep sense of calm.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 6, 11, 14],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "ACDC",
          type: "Hybrid",
          description:
            "ACDC is a sativa-dominant phenotype of the high-CBD strain, Cannatonic. It is remarkable in that its THC:CBD ratio is 1:20, which means little to no intoxicating effects. ACDC's CBD content can get as high as 19% making it great for patients looking to treat pain, anxiety, epilepsy, multiple sclerosis, and the negative effects of chemotherapy, all with a clear head. ",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 7, 21, 12],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Cannatonic",
          type: "Hybrid",
          description:
            "Cannatonic is a unique strain bred specifically for it low THC and high CBD content (Usually a 1:2 ratio or greater). It produces a relatively short-lived, mellow high that is uplifting and powerfully relaxing, courtesy of the high CBD content. Most phenotypes have a slightly earthy odor with mild citrus notes",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 7, 21, 13],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Cookies Kush",
          type: "Hybrid",
          description:
            "Cookies Kush combines GSC and a specific phenotype of OG Kush resulting in a potent indica with an earthy, sweet, and floral aroma. ",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 7, 21, 14],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "GSC",
          type: "Hybrid",
          description:
            "GSC has a sweet, earthy aroma; and delivers full-body relaxation and a time-altering cerebral high.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 7, 22, 12],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Thin Mint GSC",
          type: "Hybrid",
          description:
            "Thin Mint GSC is a phenotype of GSC with dark green and royal purple hues and a sweet minty smell. It has both the powerful full-body effects of indicas, and an intense cerebral high. Not recommended for the novice consumer.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 7, 22, 13],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Blackberry Kush",
          type: "Indica",
          description:
            "Blackberry Kush smells like someone dunked some sweet berries in jet fuel, but has a strong body effect and is a highly sought after strain for pain relief. ",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 7, 22, 14],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "NYC Diesel",
          type: "Hybrid",
          description:
            "NYC Diesel is a 60/40 sativa-dominant cross between Mexican and Afghani landrace strains which provides strong cerebral effects that ease into a full-body relaxation. This hybrid has a tendency to induce a talkative effect and is praised by anxiety-prone consumers for its paranoia-free effects.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 7, 23, 12],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Lemon Skunk",
          type: "Hybrid",
          description:
            "Conceived from two different Skunk phenotypes that exhibited strong lemon flavors, Lemon Skunk has a happy, energetic buzz that is great for depression and stress.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 7, 23, 13],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Mazar x Blueberry",
          type: "Hybrid",
          description:
            "Mazar X Blueberry is a well-rounded indica dominant hybrid that brings a nice, but not overly potent head high and a relaxing body high. This strain smells similar to its blueberry parent with woody, earthy tones. ",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 7, 23, 14],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Harlequin",
          type: "Hybrid",
          description:
            "Harlequin is a 75/25 Sativa-dominant hybrid strain with an earthy and sweet mango aromas, renown for its reliable CBD expression. It provides the clear-headed and alert sativa effects while its CBD:THC ratio of 5:2 makes it one of the most effective treatments for pain and anxiety available today.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 7, 24, 12],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "G13",
          type: "Indica",
          description:
            "According to legend, this strain was bred by an agency of the government with a coalition of the best breeders in the world. G13 is an extremely strong indica that boasts an earthy, pine flavor and is definitely worth checking out.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 7, 24, 13],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "9 Pound Hammer",
          type: "Hybrid",
          description:
            "9 Pound Hammer is an 80:20 indica dominant strain that crosses Hells OG, Jack the Ripper, and Gooberry to produce a heavy, long-lasting indica effect, useful for pain, insomnia and stress relief.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 7, 24, 14],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Ghost Train Haze",
          type: "Hybrid",
          description:
            "Ghost Train Haze is a potent sativa that knocks out pain, depression, and appetite loss with a sour citrus and flora aroma. Consumers prone to anxiety beware: This strain has been known to cause anxiety and paranoia in some people. ",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 8, 25, 12],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Cotton Candy Kush",
          type: "Hybrid",
          description:
            "Cotton Candy is a cross between the Lavender and Power Plant strains, and has a pungent, sweet, berry and floral scent. The effects of this strain will leave you feeling euphoric and relaxed and keep your stress and pain to a minimum.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 8, 25, 13],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Holy Grail Kush",
          type: "Hybrid",
          description:
            "The offspring of OG #18 and Kosher Kush, Holy Grail Kush produces a mellow relaxation and smells like Kush with a strong spicy, citrus smell.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 8, 25, 14],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Obama Kush",
          type: "Hybrid",
          description:
            "Obama Kush sets itself apart from other indica-dominant hybrids with its cerebral stimulation and euphoric rush. It has a light floral and earthy aroma and is unique in that it does not stimulate appetite or put you to sleep.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 8, 26, 12],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Cotton Candy Kush",
          type: "Hybrid",
          description:
            "Cotton Candy is a cross between the Lavender and Power Plant strains, and has a pungent, sweet, berry and floral scent. The effects of this strain will leave you feeling euphoric and relaxed and keep your stress and pain to a minimum.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 8, 26, 13],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "King's Kush",
          type: "Hybrid",
          description:
            "King's Kush is derived from OG Kush and the elusive Grape strain. It has gradual but powerful effects and smells sweet and sour with a tangy grape scent and a touch of lavender.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 8, 26, 14],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Charlotte's Web",
          type: "Sativa",
          description:
            "Charlotte's Web is cultivated with less than .3% THC and has gained popularity for its effectiveness at treating seizures as well as a range of other medical conditions. Contrary to popular belief, this strain is derived from hemp and has little to no psychoactive effects, making it great for people who do not want their medication to affect their daily tasks.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 8, 27, 12],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Jillybean",
          type: "Hybrid",
          description:
            "Jillybean has been described as an upbeat and happy hybrid with tangy orange and mango flavors. Great for the creative minds and social butterflies looking for an unencumbered euphoria during the day.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 8, 27, 13],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Critical Mass",
          type: "Hybrid",
          description:
            "Critical Mass is a combination between Afghani and Skunk #1 and has a Sweet, earthy aroma and flavor. Some phenotypes have higher percentages of CBD making this strain excellent for patients seeking relief from anxiety of inflammation.",
          imgSrc: "/images/cannabis.jpg",
          choices: [2, 8, 27, 14],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Strains", null, {});
  }
};
