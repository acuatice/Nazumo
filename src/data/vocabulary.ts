export type VocabularyEntry = {
  japanese: string;
  reading: string;
  meaning: string;
  category: string;
  example: string;
  exampleReading: string;
  exampleMeaning: string;
};

export const vocabulary: readonly VocabularyEntry[] = [
  { japanese: "水", reading: "みず · mizu", meaning: "agua", category: "Lo esencial", example: "水をください。", exampleReading: "みずをください。", exampleMeaning: "Agua, por favor." },
  { japanese: "お茶", reading: "おちゃ · ocha", meaning: "té", category: "Lo esencial", example: "お茶を飲みます。", exampleReading: "おちゃをのみます。", exampleMeaning: "Bebo té." },
  { japanese: "猫", reading: "ねこ · neko", meaning: "gato", category: "Animales", example: "猫がいます。", exampleReading: "ねこがいます。", exampleMeaning: "Hay un gato." },
  { japanese: "犬", reading: "いぬ · inu", meaning: "perro", category: "Animales", example: "犬が好きです。", exampleReading: "いぬがすきです。", exampleMeaning: "Me gustan los perros." },
  { japanese: "本", reading: "ほん · hon", meaning: "libro", category: "En casa", example: "本を読みます。", exampleReading: "ほんをよみます。", exampleMeaning: "Leo un libro." },
  { japanese: "友だち", reading: "ともだち · tomodachi", meaning: "amistad / amigo", category: "Personas", example: "友だちと話します。", exampleReading: "ともだちとはなします。", exampleMeaning: "Hablo con un amigo." },
  { japanese: "おいしい", reading: "oishii", meaning: "delicioso", category: "Comida", example: "これはおいしいです。", exampleReading: "これはおいしいです。", exampleMeaning: "Esto está delicioso." },
  { japanese: "こんにちは", reading: "konnichiwa", meaning: "hola / buenas tardes", category: "Saludos", example: "こんにちは、元気ですか。", exampleReading: "こんにちは、げんきですか。", exampleMeaning: "Hola, ¿cómo estás?" },
  { japanese: "ありがとう", reading: "arigatō", meaning: "gracias", category: "Saludos", example: "ありがとうございます。", exampleReading: "ありがとうございます。", exampleMeaning: "Muchas gracias." },
  { japanese: "駅", reading: "えき · eki", meaning: "estación", category: "Por la ciudad", example: "駅はどこですか。", exampleReading: "えきはどこですか。", exampleMeaning: "¿Dónde está la estación?" },
  { japanese: "今日", reading: "きょう · kyō", meaning: "hoy", category: "Tiempo", example: "今日はいい天気です。", exampleReading: "きょうはいいてんきです。", exampleMeaning: "Hoy hace buen tiempo." },
  { japanese: "好き", reading: "すき · suki", meaning: "gustar", category: "Personas", example: "日本語が好きです。", exampleReading: "にほんごがすきです。", exampleMeaning: "Me gusta el japonés." },
];
