import { BookFeatures } from "../models/BookOrShelf";
import RNFS from "react-native-fs";
import { fetchHtml } from "../storage/BookStorage";

interface MetaData {
  bloomdVersion?: number;
  features?: BookFeatures[];
}

export default async function getFeaturesList(
  metaData: MetaData,
  tmpBookPath: string
): Promise<BookFeatures[]> {
  if (
    metaData.features &&
    metaData.bloomdVersion &&
    metaData.bloomdVersion >= 1
  )
    return metaData.features;

  const features = [];
  if (await hasAudio(tmpBookPath)) features.push(BookFeatures.talkingBook);

  return features;
}

async function hasAudio(tmpBookPath: string): Promise<boolean> {
  const audioDirPath = `${tmpBookPath}/audio`;
  const audioDirExists = await RNFS.exists(audioDirPath);
  const hasAudioFiles =
    audioDirExists && (await RNFS.readdir(audioDirPath)).length > 0;
  const html = await fetchHtml(tmpBookPath);
  const hasAudioSentences = html.includes("audio-sentence");
  return hasAudioFiles && hasAudioSentences;
}
