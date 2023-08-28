import { Box, Heading } from "@chakra-ui/react";
import ProcessImage from "./Feature/Tesseract/ProcessImage";
function App() {
  return (
    <Box bg="#232323" color="#fff" w="100vw" minH="100dvh" p="0.25rem">
      <Heading textAlign={"center"}>Tesseract OCR</Heading>
      <ProcessImage />
    </Box>
  );
}

export default App;
