import fs from "fs";
import {PDFParse} from "pdf-parse";
import { config } from "../config/config.js";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: config.PINECONE_API_KEY,
});
const index = pinecone.Index(config.PINECONE_INDEX);

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey:config.MISTRAL_API_KEY
});

// async function loadPDF() {
//     const buffer = fs.readFileSync("./FlexDrip2.pdf");
//   const parser = new PDFParse({data:buffer})
//   const result = await parser.getText();
	
//   return result.text;
// }
// let document= await loadPDF()

// const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 200, chunkOverlap: 50 })
// const texts = await splitter.splitText(document)


// const vectors = await embeddings.embedDocuments(texts);

// // format for pinecone
// const records = vectors.map((vec, i) => ({
//   id: `chunk-${i}`,
//   values: vec,
//   metadata: {
//     text: texts[i]
//   }
// }));
// console.log(records)

// // store

// await index.upsert({records:records});

export {embeddings,index}