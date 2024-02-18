// Selecting the database to use
use('FictionaryDB');

// Inserting all of the words
db.getCollection('words').insertMany([
    {'category': 'animals', 'word': 'cat'},
    {'category': 'animals', 'word': 'dog'},
    {'category': 'animals', 'word': 'cow'},
    {'category': 'animals', 'word': 'pig'},
    {'category': 'animals', 'word': 'sheep'},
    {'category': 'animals', 'word': 'goat'},
    {'category': 'animals', 'word': 'chicken'},
    {'category': 'animals', 'word': 'rooster'},
    {'category': 'animals', 'word': 'bird'},
    {'category': 'animals', 'word': 'duck'},
    {'category': 'animals', 'word': 'swan'},
    {'category': 'animals', 'word': 'lizard'},
    {'category': 'animals', 'word': 'turtle'},
    {'category': 'animals', 'word': 'frog'},
    {'category': 'animals', 'word': 'axolotl'},
    {'category': 'animals', 'word': 'fish'},
    {'category': 'animals', 'word': 'whale'},
    {'category': 'animals', 'word': 'dolphin'},
    {'category': 'animals', 'word': 'fox'},
    {'category': 'animals', 'word': 'rabbit'},
    {'category': 'animals', 'word': 'mouse'},
    {'category': 'animals', 'word': 'deer'},
    {'category': 'animals', 'word': 'horse'},
    {'category': 'animals', 'word': 'donkey'},
    {'category': 'animals', 'word': 'rat'},
    {'category': 'animals', 'word': 'otter'},
    {'category': 'animals', 'word': 'raccon'},
    {'category': 'animals', 'word': 'squirrel'},
    {'category': 'animals', 'word': 'eel'},
    {'category': 'animals', 'word': 'snake'},
    {'category': 'animals', 'word': 'seal'},
    {'category': 'animals', 'word': 'walrus'},

    {'category': 'food', 'word': 'cake'},
    {'category': 'food', 'word': 'burrito'},
    {'category': 'food', 'word': 'pizza'},
    {'category': 'food', 'word': 'salad'},
    {'category': 'food', 'word': 'sandwich'},
    {'category': 'food', 'word': 'steak'},
    {'category': 'food', 'word': 'potato'},
    {'category': 'food', 'word': 'tomato'},
    {'category': 'food', 'word': 'carrot'},
    {'category': 'food', 'word': 'apple'},
    {'category': 'food', 'word': 'toast'},
    {'category': 'food', 'word': 'eggs'},
    {'category': 'food', 'word': 'ham'},
    {'category': 'food', 'word': 'turkey'},
    {'category': 'food', 'word': 'bread'},
    {'category': 'food', 'word': 'burger'},
    {'category': 'food', 'word': 'soup'},
    {'category': 'food', 'word': 'peas'},
    {'category': 'food', 'word': 'grapes'},
    {'category': 'food', 'word': 'pear'},
    {'category': 'food', 'word': 'cheese'},
    {'category': 'food', 'word': 'macaroni'},
    {'category': 'food', 'word': 'spaghetti'},
    {'category': 'food', 'word': 'ravioli'},
    {'category': 'food', 'word': 'lasagna'},
    {'category': 'food', 'word': 'cookie'},
    {'category': 'food', 'word': 'candy'},
    {'category': 'food', 'word': 'chocolate'},
    {'category': 'food', 'word': 'ice cream'},
    {'category': 'food', 'word': 'pie'},
    {'category': 'food', 'word': 'chips'},
    {'category': 'food', 'word': 'fried rice'},
    {'category': 'food', 'word': 'dumplings'},
    {'category': 'food', 'word': 'broccoli'},
    {'category': 'food', 'word': 'porridge'},
    {'category': 'food', 'word': 'strawberry'},

    {'category': 'clothing', 'word': 'purse'},
    {'category': 'clothing', 'word': 'backpack'},
    {'category': 'clothing', 'word': 'tie'},
    {'category': 'clothing', 'word': 'dress'},
    {'category': 'clothing', 'word': 'heels'},
    {'category': 'clothing', 'word': 'sneakers'},
    {'category': 'clothing', 'word': 'boots'},
    {'category': 'clothing', 'word': 'socks'},
    {'category': 'clothing', 'word': 'gloves'},
    {'category': 'clothing', 'word': 'scarf'},
    {'category': 'clothing', 'word': 'earrings'},
    {'category': 'clothing', 'word': 'ring'},
    {'category': 'clothing', 'word': 'necklace'},
    {'category': 'clothing', 'word': 'skirt'},
    {'category': 'clothing', 'word': 'shorts'},
    {'category': 'clothing', 'word': 't-shirt'},
    {'category': 'clothing', 'word': 'glasses'},
    {'category': 'clothing', 'word': 'goggles'},
    {'category': 'clothing', 'word': 'beanie'},
    {'category': 'clothing', 'word': 'cap'},
    {'category': 'clothing', 'word': 'beret'},
    {'category': 'clothing', 'word': 'jacket'},
    {'category': 'clothing', 'word': 'coat'},
    {'category': 'clothing', 'word': 'sweater'},
    {'category': 'clothing', 'word': 'pants'},
    {'category': 'clothing', 'word': 'scrunchie'},
    {'category': 'clothing', 'word': 'bracelet'},
    {'category': 'clothing', 'word': 'earmuffs'},
    {'category': 'clothing', 'word': 'vest'},
    {'category': 'clothing', 'word': 'tuxedo'},

    {'category': 'places', 'word': 'park'},
    {'category': 'places', 'word': 'store'},
    {'category': 'places', 'word': 'house'},
    {'category': 'places', 'word': 'skyscraper'},
    {'category': 'places', 'word': 'bank'},
    {'category': 'places', 'word': 'hospital'},
    {'category': 'places', 'word': 'school'},
    {'category': 'places', 'word': 'factory'},
    {'category': 'places', 'word': 'highway'},
    {'category': 'places', 'word': 'train station'},
    {'category': 'places', 'word': 'bus stop'},
    {'category': 'places', 'word': 'cafe'},
    {'category': 'places', 'word': 'city'},
    {'category': 'places', 'word': 'pool'},
    {'category': 'places', 'word': 'gym'},
    {'category': 'places', 'word': 'office'},
    {'category': 'places', 'word': 'courtroom'},
    {'category': 'places', 'word': 'castle'},
    {'category': 'places', 'word': 'zoo'},
    {'category': 'places', 'word': 'aquarium'},
    {'category': 'places', 'word': 'kitchen'},
    {'category': 'places', 'word': 'theatre'},
    {'category': 'places', 'word': 'alleyway'},
    {'category': 'places', 'word': 'stadium'},
    {'category': 'places', 'word': 'restaurant'},

    {'category': 'technology', 'word': 'computer'},
    {'category': 'technology', 'word': 'laptop'},
    {'category': 'technology', 'word': 'cellphone'},
    {'category': 'technology', 'word': 'telephone'},
    {'category': 'technology', 'word': 'mouse'},
    {'category': 'technology', 'word': 'keyboard'},
    {'category': 'technology', 'word': 'printer'},
    {'category': 'technology', 'word': 'camera'},
    {'category': 'technology', 'word': 'robot'},
    {'category': 'technology', 'word': 'television'},
    {'category': 'technology', 'word': 'controller'},
    {'category': 'technology', 'word': 'radio'},
    {'category': 'technology', 'word': 'microphone'},
    {'category': 'technology', 'word': 'sattelite'},
    {'category': 'technology', 'word': 'telescope'},
    {'category': 'technology', 'word': 'disk'},
    {'category': 'technology', 'word': 'motherboard'},
    {'category': 'technology', 'word': 'earbuds'},
    {'category': 'technology', 'word': 'headphones'},
    {'category': 'technology', 'word': 'sonar'},
    {'category': 'technology', 'word': 'tablet'},
    {'category': 'technology', 'word': 'cassette tape'},

    {'category': 'nature', 'word': 'beach'},
    {'category': 'nature', 'word': 'ocean'},
    {'category': 'nature', 'word': 'pond'},
    {'category': 'nature', 'word': 'river'},
    {'category': 'nature', 'word': 'mountain'},
    {'category': 'nature', 'word': 'tree'},
    {'category': 'nature', 'word': 'forrest'},
    {'category': 'nature', 'word': 'desert'},
    {'category': 'nature', 'word': 'cave'},
    {'category': 'nature', 'word': 'flower'},
    {'category': 'nature', 'word': 'bush'},
    {'category': 'nature', 'word': 'stones'},
    {'category': 'nature', 'word': 'rain'},
    {'category': 'nature', 'word': 'lighting'},
    {'category': 'nature', 'word': 'snow'},
    {'category': 'nature', 'word': 'sun'},
    {'category': 'nature', 'word': 'moon'},
    {'category': 'nature', 'word': 'stars'},
    {'category': 'nature', 'word': 'valley'},
    {'category': 'nature', 'word': 'hills'},
    {'category': 'nature', 'word': 'cliff'},
    {'category': 'nature', 'word': 'clouds'},
    {'category': 'nature', 'word': 'wind'},
    {'category': 'nature', 'word': 'leaves'},
    {'category': 'nature', 'word': 'pinecone'},
    {'category': 'nature', 'word': 'acorn'},
    {'category': 'nature', 'word': 'seed'},
    {'category': 'nature', 'word': 'sprout'},
    {'category': 'nature', 'word': 'waves'},
    {'category': 'nature', 'word': 'volcano'},
    {'category': 'nature', 'word': 'seashell'},
    {'category': 'nature', 'word': 'log'},

    {'category': 'objects', 'word': 'cup'},
    {'category': 'objects', 'word': 'mug'},
    {'category': 'objects', 'word': 'watering can'},
    {'category': 'objects', 'word': 'bowl'},
    {'category': 'objects', 'word': 'vase'},
    {'category': 'objects', 'word': 'pitcher'},
    {'category': 'objects', 'word': 'chair'},
    {'category': 'objects', 'word': 'couch'},
    {'category': 'objects', 'word': 'table'},
    {'category': 'objects', 'word': 'shelf'},
    {'category': 'objects', 'word': 'cabinet'},
    {'category': 'objects', 'word': 'drawers'},
    {'category': 'objects', 'word': 'bench'},
    {'category': 'objects', 'word': 'door'},
    {'category': 'objects', 'word': 'window'},
    {'category': 'objects', 'word': 'lamp'},
    {'category': 'objects', 'word': 'paintbrush'},
    {'category': 'objects', 'word': 'pen'},
    {'category': 'objects', 'word': 'pencil'},
    {'category': 'objects', 'word': 'hammer'},
    {'category': 'objects', 'word': 'sheers'},
    {'category': 'objects', 'word': 'scissors'},
    {'category': 'objects', 'word': 'kettle'},
    {'category': 'objects', 'word': 'bottle'},
    {'category': 'objects', 'word': 'jar'},
    {'category': 'objects', 'word': 'tire'},

    {'category': 'transportation', 'word': 'car'},
    {'category': 'transportation', 'word': 'truck'},
    {'category': 'transportation', 'word': 'van'},
    {'category': 'transportation', 'word': 'airplane'},
    {'category': 'transportation', 'word': 'jet'},
    {'category': 'transportation', 'word': 'bicycle'},
    {'category': 'transportation', 'word': 'motorcycle'},
    {'category': 'transportation', 'word': 'train'},
    {'category': 'transportation', 'word': 'trolley'},
    {'category': 'transportation', 'word': 'bus'},
    {'category': 'transportation', 'word': 'scooter'},
    {'category': 'transportation', 'word': 'moped'},
    {'category': 'transportation', 'word': 'skateboard'},
    {'category': 'transportation', 'word': 'skates'},
    {'category': 'transportation', 'word': 'sled'},
    {'category': 'transportation', 'word': 'carriage'},
    {'category': 'transportation', 'word': 'cart'},
    {'category': 'transportation', 'word': 'wagon'},
    {'category': 'transportation', 'word': 'animal'},
    {'category': 'transportation', 'word': 'boat'},
    {'category': 'transportation', 'word': 'sailboat'},
    {'category': 'transportation', 'word': 'ship'},
    {'category': 'transportation', 'word': 'rowboat'},
    {'category': 'transportation', 'word': 'socket'},
    {'category': 'transportation', 'word': 'spaceship'},
    {'category': 'transportation', 'word': 'submarine'},

    {'category': 'instruments', 'word': 'tuba'},
    {'category': 'instruments', 'word': 'saxophone'},
    {'category': 'instruments', 'word': 'trombone'},
    {'category': 'instruments', 'word': 'flute'},
    {'category': 'instruments', 'word': 'recorder'},
    {'category': 'instruments', 'word': 'harmonica'},
    {'category': 'instruments', 'word': 'piano'},
    {'category': 'instruments', 'word': 'keyboard'},
    {'category': 'instruments', 'word': 'guitar'},
    {'category': 'instruments', 'word': 'harp'},
    {'category': 'instruments', 'word': 'xylophone'},
    {'category': 'instruments', 'word': 'lute'},
    {'category': 'instruments', 'word': 'drums'},
    {'category': 'instruments', 'word': 'bongos'},
    {'category': 'instruments', 'word': 'ukulele'},
    {'category': 'instruments', 'word': 'maracas'},
    {'category': 'instruments', 'word': 'ocarina'},
    {'category': 'instruments', 'word': 'violin'},
    {'category': 'instruments', 'word': 'horn'},
    {'category': 'instruments', 'word': 'bass'},
    {'category': 'instruments', 'word': 'tambourine'},
    {'category': 'instruments', 'word': 'cymbals'},
    {'category': 'instruments', 'word': 'bells'},

    {'category': 'invertibrates', 'word': 'bee'},
    {'category': 'invertibrates', 'word': 'spider'},
    {'category': 'invertibrates', 'word': 'crab'},
    {'category': 'invertibrates', 'word': 'lobster'},
    {'category': 'invertibrates', 'word': 'shrimp'},
    {'category': 'invertibrates', 'word': 'centipede'},
    {'category': 'invertibrates', 'word': 'snail'},
    {'category': 'invertibrates', 'word': 'octopus'},
    {'category': 'invertibrates', 'word': 'squid'},
    {'category': 'invertibrates', 'word': 'mussel'},
    {'category': 'invertibrates', 'word': 'mantis'},
    {'category': 'invertibrates', 'word': 'beetle'},
    {'category': 'invertibrates', 'word': 'leech'},
    {'category': 'invertibrates', 'word': 'slug'},
    {'category': 'invertibrates', 'word': 'ant'},
    {'category': 'invertibrates', 'word': 'wasp'},
    {'category': 'invertibrates', 'word': 'pill bug'},
    {'category': 'invertibrates', 'word': 'cricket'},
    {'category': 'invertibrates', 'word': 'cicada'},
    {'category': 'invertibrates', 'word': 'stink bug'},
    {'category': 'invertibrates', 'word': 'firefly'},
    {'category': 'invertibrates', 'word': 'fly'},
    {'category': 'invertibrates', 'word': 'worm'},
    {'category': 'invertibrates', 'word': 'caterpillar'},
    {'category': 'invertibrates', 'word': 'butterfly'},
    {'category': 'invertibrates', 'word': 'moth'},
    {'category': 'invertibrates', 'word': 'dragonfly'},
    {'category': 'invertibrates', 'word': 'anemone'},
    {'category': 'invertibrates', 'word': 'jellyfish'},
    {'category': 'invertibrates', 'word': 'starfish'},    
]);