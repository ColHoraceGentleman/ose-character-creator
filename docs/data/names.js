// Populate name_set with race/class name samples for Markov chain generation

// Human (generic fantasy — used for Fighter, Cleric, Thief, Magic-User, Barbarian, Bard, Druid, Illusionist, Acrobat, Assassin, Knight, Paladin, Ranger)
name_set["human"] = [
  "Aldric","Bram","Caius","Darian","Edric","Fabian","Gareth","Hadwin","Idris","Jareth",
  "Kael","Leoric","Maren","Nolan","Osric","Perin","Quinn","Rolan","Seris","Theron",
  "Ulric","Varen","Wynn","Xander","Yoric","Zane","Aldara","Brynn","Calla","Dara",
  "Elara","Fenna","Gwen","Hilda","Ilara","Jessa","Kira","Lyra","Mira","Nessa",
  "Orin","Petra","Rena","Sable","Tara","Una","Vera","Wren","Yara","Zara"
];

// Dwarf (and Duergar — dark dwarf)
name_set["dwarf"] = [
  "Balin","Bifur","Bofur","Bombur","Dain","Dori","Durin","Fili","Floi","Fundin",
  "Gloin","Groin","Kili","Loni","Nain","Nori","Oin","Ori","Thorin","Thrain",
  "Gimli","Grimir","Hanar","Ibun","Khim","Lofar","Mim","Naeg","Nar","Nippur",
  "Rurik","Skald","Snorri","Torvald","Ulfr","Veit","Brenna","Dagny","Hilda","Ingrid",
  "Kira","Marta","Sigrid","Thyra","Ulfhild","Vigdis"
];

name_set["duergar"] = [
  "Brak","Darg","Drizzt","Goruk","Grim","Hroth","Krag","Morg","Narg","Rork",
  "Skrag","Thrak","Ulgar","Vrak","Zarg","Beld","Druk","Glum","Keld","Meld",
  "Neld","Reld","Seld","Teld","Veld","Agna","Braga","Dagra","Grima","Helga",
  "Ingra","Karga","Marga","Narga","Urga"
];

// Elf (and Half-Elf — blend of elven and human)
name_set["elf"] = [
  "Aelindra","Aerith","Ailindel","Alassiel","Amroth","Aranwe","Ariel","Arwen","Caladwen","Calen",
  "Celeborn","Cirdan","Elenwe","Elladan","Elrohir","Elrond","Elwe","Erevan","Faervel","Faewyn",
  "Galathil","Galadriel","Gilmith","Glorfindel","Idril","Ithildin","Laerith","Legolas","Lindir","Luthien",
  "Maedhros","Maeglin","Miriel","Nenweth","Nimrodel","Oropher","Quennar","Rithiel","Silinde","Tarandil",
  "Thranduil","Tuilinn","Valandil","Vanyel","Voronwe","Wynmir","Yaveril","Zylvara"
];

name_set["half-elf"] = [
  "Aelric","Aewyn","Aldan","Aravel","Branwen","Caelan","Daewyn","Eldan","Farawen","Galen",
  "Haelith","Ilawen","Joren","Kaelith","Laewyn","Maewen","Naedan","Orelith","Paewyn","Raelith",
  "Saeldan","Taelwyn","Urelith","Vaeldan","Wraelith","Yrael","Zaelwyn","Aelara","Braelith","Caewyn"
];

// Halfling
name_set["halfling"] = [
  "Andwise","Bingo","Blanco","Bowman","Bungo","Cotman","Drogo","Folco","Fosco","Fredegar",
  "Gerontius","Hamfast","Isumbras","Largo","Lotho","Marmaduke","Meriadoc","Milo","Odo","Paladin",
  "Peregrin","Polo","Posco","Ponto","Rorimac","Rufus","Samwise","Tobold","Tomba","Wilcome",
  "Amaranth","Belba","Camellia","Chica","Daisy","Eglantine","Esmeralda","Hilda","Lobelia","Marigold",
  "Melilot","Mirabella","Pansy","Pearl","Peony","Primula","Rosie","Ruby","Salvia","Violet"
];

// Gnome
name_set["gnome"] = [
  "Alston","Alvyn","Boddynock","Brocc","Burgell","Dimble","Eldon","Erky","Fonkin","Frug",
  "Gerbo","Gimble","Glim","Jebeddo","Kellen","Namfoodle","Orryn","Roondar","Seebo","Sindri",
  "Warryn","Wrenn","Zook","Bimpnottin","Caramip","Duvamil","Ella","Ellyjobell","Ellywick","Lilli",
  "Loopmottin","Lorilla","Mardnab","Nissa","Nyx","Oda","Orla","Roywyn","Shamil","Tana",
  "Tetso","Tippletoe","Ulla","Velvet","Vivi","Zangi"
];

// Drow
name_set["drow"] = [
  "Alton","Andzrel","Drizzt","Pharaun","Ryld","Valas","Vhaerun","Zak","Zaknafein","Jarlaxle",
  "Kelnozz","Masoj","Nalfein","Nieque","Oblodra","Rai-guy","Sos'Umptu","Triel","Uluyara","Vorn",
  "Akordia","Aundry","Charinida","Darthiir","Eclavdra","Flinderspeld","Greyanna","Imrae","Jhulae","Kelnafein",
  "Liriel","Malarite","Nedylene","Nathrae","Pelothar","Qilue","Shyntlara","Tathlyn","Ulvrain","Vierna",
  "Vivian","Wod","Xullrae","Ysolde","Zeerith"
];

// Half-Orc
name_set["half-orc"] = [
  "Argrath","Brugash","Drogash","Fenrik","Ghrask","Grommash","Hakkar","Irontusk","Jarnak","Kargath",
  "Largash","Malgash","Narkul","Orgrim","Prugash","Ragnash","Skullcrusher","Thrakash","Urgash","Vragash",
  "Wargash","Yargash","Zargash","Araga","Braga","Draga","Ferga","Graga","Harga","Iraga",
  "Karga","Larga","Marga","Narga","Orga","Praga","Raga","Skarga","Thraga","Urga"
];