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
// IKEA product names — for the IKEA Name Generator option
const IKEA_NAMES = [
  "Adde","Adils","Agam","Agen","Alefjäll","Alex","Algot","Alseda","Alvaret","Angersby",
  "Antilop","Användbar","Arkelstorp","Askeby","Askholmen","Askvoll","Auli","Backaryd","Bagganäs","Balsberget",
  "Baltsar","Bekant","Bekväm","Benarp","Benö","Bergenes","Berghalla","Bergsbo","Bernhard","Bertil",
  "Bestå","Billsbro","Billy","Bingsta","Bjorli","Bjursta","Bjärred","Björksnäs","Bleckberget","Blyskär",
  "Blåmes","Bolmen","Bortberg","Bosnäs","Bottna","Brattvåg","Brennåsen","Brimnes","Brommö","Bror",
  "Broringe","Brusali","Brusen","Bryggja","Bryne","Brynilen","Bräda","Bråthult","Bunsö","Burfjord",
  "Burvik","Busa","Buskbo","Bussan","Busunge","Byllan","Byås","Båtsfjord","Börje","Cilla",
  "Cirkustält","Dagotto","Dalfred","Dalshult","Delaktig","Detolf","Dietmar","Dihult","Djupvik","Duvholmen",
  "Edvalla","Ekedalen","Ekenäs","Ekerö","Eket","Ekolsund","Ektorp","Elsebet","Elvarli","Emten",
  "Eneryda","Enetri","Erik","Ernfrid","Fabrikör","Falholmen","Fanbyn","Fejan","Finnby","Finnvard",
  "Fixa","Fjällberget","Fjällbo","Flekke","Flintan","Flisat","Flottebo","Flytta","Forsand","Franklin",
  "Fredde","Fredön","Frekvens","Friheten","Fritids","Frösön","Fusion","Fyresdal","Färlöv","Följa",
  "Förhöja","Försiktig","Galant","Gamlared","Gamlarp","Gamleby","Gamlehult","Genevad","Gersby","Gerton",
  "Gistad","Gjöra","Gladom","Glasholm","Glassvik","Glenn","Gnedby","Godishus","Godvin","Gonatt",
  "Granboda","Grimo","Grundsund","Grundtal","Gruvbyn","Gryttby","Grälviken","Grönadal","Grönlid","Gualöv",
  "Gubbarp","Gulliver","Gunde","Gårö","Hackås","Hammarn","Hanviken","Harry","Hasvik","Hattefjäll",
  "Havsta","Havsten","Hedra","Hejne","Helmer","Hemnes","Henriksdal","Herdis","Hillared","Hilver",
  "Hishult","Hokksund","Hol","Holmsund","Hornavan","Husarö","Hyllis","Hällan","Hässelby","Hållö",
  "Högsma","Idåsen","Ingatorp","Ingo","Ingolf","Innamo","Isberget","Ivar","Janinge","Jokkmokk",
  "Jonaxel","Jules","Justina","Jäppling","Järvfjället","Kallax","Kallrör","Kallviken","Karlhugo","Karljan",
  "Kivik","Klackberg","Kleppstad","Klimpen","Klippan","Knarrevik","Knopparp","Knotten","Koarp","Kolbjörn",
  "Kolon","Kongsfjord","Koppang","Kornsjö","Kragsta","Krille","Kritter","Krokholmen","Kuddarna","Kullaberg",
  "Kullen","Kungsfors","Kungshamn","Kungsholmen","Kungsö","Kura","Kvistbro","Kyrre","Lack","Laiva",
  "Lalle","Landskrona","Laneberg","Langur","Lappland","Lappviken","Lauvik","Laxviken","Leifarne","Leirvik",
  "Len","Lennart","Lerberg","Lerhamn","Liatorp","Lidhult","Lidkullen","Lierskogen","Lillhöjden","Lillåsen",
  "Lindved","Linnmon","Lisabo","Listerby","Lixhult","Ljuv","Loberget","Lommarp","Lote","Lubban",
  "Lunnarp","Luröy","Lycksele","Läckö","Lätt","Långfjäll","Löva","Lövbacken","Mackapär","Malinda",
  "Malm","Malmsta","Malsjö","Mammut","Marius","Markerad","Markus","Martin","Maryd","Mastholmen",
  "Mehamn","Melltorp","Micke","Millberget","Milsbo","Minnen","Molte","Morliden","Mosjö","Mossaryd",
  "Mostorp","Muren","Mydal","Mästerby","Möckelby","Möjlighet","Möllarp","Mörbylånga","Nannarp","Neiden",
  "Nesttun","Nikkeby","Nilserik","Nilsove","Nissafors","Nisse","Nockeby","Nolmyra","Nominell","Norberg",
  "Norden","Nordkisa","Nordli","Nordmela","Nordviken","Norna","Norraryd","Norrnäs","Norråker","Norsborg",
  "Notviken","Nyboda","Nyhamn","Observatör","Oddbjörg","Oddvald","Odger","Olaus","Olov","Orrnäs",
  "Oxberg","Pax","Pello","Platsa","Poäng","Prästholm","Påhl","Rakkestad","Ramsta","Rast",
  "Regissör","Remsta","Renberget","Resö","Ridabu","Riksviken","Rimforsa","Risatorp","Rothult","Rydebäck",
  "Rådviken","Råshult","Råskog","Rödeby","Rönninge","Sagstua","Sakarias","Saltholmen","Sandared","Sandbacken",
  "Sandvika","Sekken","Selsviken","Setskog","Sibben","Sindvik","Själland","Skarpö","Skarsta","Skogsta",
  "Skogstorp","Skruvsta","Skubb","Skärhamn","Skådis","Skålberg","Skötsam","Slattum","Slähult","Släkt",
  "Smågöra","Sniglar","Snille","Solgul","Sollerön","Songesand","Sporren","Stackholmen","Stallarp","Stefan",
  "Stegön","Stensele","Stenstorp","Stig","Stockholm","Stocksund","Stockviken","Stoljan","Strandmon","Stråfly",
  "Stubbarp","Stuk","Stuva","Sufflett","Sularp","Sultan","Summera","Sundlandet","Sundsta","Sundvik",
  "Sunnea","Sunnersta","Svalnäs","Svalsta","Svanö","Svenarne","Svenbertil","Svärta","Syvde","Säbövik",
  "Söderhamn","Tarva","Teodores","Terje","Thyge","Timmerviken","Tingby","Tobias","Tofteryd","Tommaryd",
  "Torholmen","Tornviken","Torsby","Torsklint","Tossberg","Tosterö","Tranarö","Trofast","Trogen","Trollberget",
  "Trulstorp","Trysil","Tuffing","Tullsta","Tyssedal","Tärendö","Tärnö","Ulriksberg","Uppleva","Urban",
  "Utter","Utåker","Vadholma","Vallentuna","Vangsta","Vassviken","Vattviken","Veberöd","Vedbo","Vejmon",
  "Vesken","Vidga","Viggja","Vikare","Vikedal","Vikhammer","Vilto","Vimle","Vimund","Vingrom",
  "Vinterbro","Vippärt","Visthus","Vittsjö","Vitval","Volfgang","Vuku","Väddö","Vädra","Västanby",
  "Västanå","Yngvar","Ypperlig","Ytterön","Äpplarö","Åmliden","Önsklig","Örfjäll","Östernäs","Övraryd"
];
