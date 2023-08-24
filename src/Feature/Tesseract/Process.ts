import { createWorker } from "tesseract.js";

const worker = await createWorker({
  logger: (m) => console.log(m),
});

async () => {
  worker.load();
  worker.loadLanguage("tha");
  const {
    data: { text },
  } = worker.recognize("imagePath");
  console.log(text);
  worker.terminate();
};
