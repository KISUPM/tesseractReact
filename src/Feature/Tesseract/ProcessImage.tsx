/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  Box,
  Button,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Kbd,
  Spinner,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import { AiOutlineDelete, AiOutlineEnter } from "react-icons/ai";

const ProcessImage = () => {
  const [textExtract, setText] = useState("No Image Select");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>();
  const [textShow, setTextShow] = useState("");
  const [lang, setLang] = useState<string[]>(["eng", "tha"]);
  const [keywords, setKeywords] = useState<string[]>(["ชื่อเส้นทาง"]);
  const [imageFile, setImageFile] = useState<any>();

  const sleep = (s: number) => {
    textShow;
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
  };

  const handleImageUpload = async (event: any) => {
    if (lang.length !== 0) {
      const inputFile: File = event.target.files[0];
      setImageFile(inputFile);
    } else {
      alert("Please Select At Least 1 Language Before Process");
    }
  };

  const tesseractExtract = async () => {
    setIsLoading(true);
    if (imageFile) {
      setSelectedImage(URL.createObjectURL(imageFile));
      const {
        data: { text },
      } = await Tesseract.recognize(imageFile, lang as unknown as string);
      let modify = "";
      if (lang.includes("tha")) {
        modify = text.split(" ").join("");
      } else {
        modify = text;
      }
      setText(modify);
    } else {
      setText("No image Select");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    tesseractExtract();
  }, [imageFile]);

  const showText = async () => {
    const l = textExtract.replace("\n", " ").split("").length;
    setTextShow("");
    for (let i = 0; i < l; i++) {
      setTextShow((prev) => {
        return prev + textExtract[i];
      });
      await sleep(0.005);
    }
  };

  useEffect(() => {
    if (textExtract !== "No Image Select") {
      showText();
    }
  }, [textExtract]);

  const extractFromKeyword = (k: string): string => {
    const found = textExtract.indexOf(k);
    if (found != -1) {
      // console.log(textExtract);
      const thaiReg = /[\u0E00-\u0E7F]+/g;
      const numReg = /^\d$/;
      const start_index = textExtract.indexOf(k) + k.length;
      let extract = textExtract[start_index];
      let char = textExtract[start_index + 1];
      let isThai = thaiReg.test(char);
      let next = 1;
      let count = 0;
      while (
        (!thaiReg.test(char) || isThai) &&
        count <= 100 &&
        char !== undefined
      ) {
        extract += char;
        next += 1;
        char = textExtract[start_index + next];
        if (!thaiReg.test(char) && !numReg.test(char)) {
          isThai = thaiReg.test(char);
        }
        if (thaiReg.test(char) && isThai === false) {
          break;
        }
        count += 1;
      }
      if (count >= 100) {
        extract += "... << the text is too long >>";
      }
      return extract;
    } else {
      return "Not Found";
    }
  };

  return (
    <Box>
      <Box w="fit-content" opacity={isLoading ? "0.3" : "1"} m="auto">
        <label htmlFor="imageInput">
          <Text
            cursor="pointer"
            border="1px solid #fff"
            w="fit-content"
            p="0.25rem"
            _hover={{ bg: "#fff3" }}
            transition={"all 0.3s"}
          >
            Select {imageFile && "New"} Image
          </Text>
        </label>
        <Input
          disabled={isLoading}
          type="file"
          display="none"
          id="imageInput"
          accept="image/*"
          onChange={handleImageUpload}
          multiple
        />
      </Box>
      <Box
        border="1px solid #fff"
        p="0.25rem"
        borderRadius={"5px"}
        my="0.25rem"
      >
        <Text fontWeight={"bold"}>Add Language Tag</Text>
        <HStack pl="0.5rem">
          <HStack>
            <Text w="2rem">Thai</Text>
            <Switch
              defaultChecked={lang.includes("tha")}
              onChange={(e) => {
                const th = e.target.checked;
                if (th) {
                  setLang((prev) => [...prev, "tha"]);
                } else {
                  setLang((prev) => prev.filter((i) => i !== "tha"));
                }
              }}
            />
          </HStack>
          <HStack>
            <Text w="2rem">Eng</Text>
            <Switch
              defaultChecked={lang.includes("eng")}
              onChange={(e) => {
                const en = e.target.checked;
                if (en) {
                  setLang((prev) => [...prev, "eng"]);
                } else {
                  setLang((prev) => prev.filter((i) => i !== "eng"));
                }
              }}
            />
          </HStack>
        </HStack>
      </Box>
      <Box
        border="1px solid #fff"
        p="0.25rem"
        borderRadius={"5px"}
        my="0.25rem"
      >
        <HStack align={"flex-start"}>
          <Box w="50%">
            <Text fontWeight={"bold"}>Your Image :</Text>
            {selectedImage && (
              <Box
                p="1rem"
                w="100%"
                h="100%"
                display="flex"
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Image
                  src={selectedImage}
                  maxW="50vw"
                  maxH="40dvh"
                  draggable={false}
                />
              </Box>
            )}
          </Box>
          <Box w="50%">
            <Text fontWeight={"bold"}>Extracted Text :</Text>
            <Box
              p="1rem"
              w="100%"
              h="100%"
              display="flex"
              justifyContent={"center"}
              alignItems={"center"}
            >
              {isLoading ? (
                <Spinner />
              ) : textExtract === "No Image Select" ? (
                <Text>{textExtract}</Text>
              ) : (
                <Textarea
                  defaultValue={textExtract}
                  w="100%"
                  h="100%"
                  rows={10}
                />
              )}
            </Box>
          </Box>
        </HStack>
        <Box w="fit-content" m="auto">
          <Button onClick={tesseractExtract}>Reload Extract</Button>
        </Box>
      </Box>
      <Box
        border="1px solid #fff"
        p="0.25rem"
        borderRadius={"5px"}
        my="0.25rem"
      >
        <Text>Keywords</Text>
        <InputGroup w="20%">
          <Input
            id="keywordInput"
            placeholder="add keyword"
            type="text"
            onKeyDown={(e) => {
              const key = e.key;
              const input = e.currentTarget.value;
              if (key === "Enter") {
                if (!keywords.includes(input) && input.trim() !== "") {
                  const vowelAUM = " ํา".trim();
                  setKeywords((prev) => [
                    ...prev,
                    input.replace("ำ", vowelAUM),
                  ]);
                  e.currentTarget.value = "";
                }
              }
            }}
            borderRight={"none"}
          />
          <InputRightAddon bg="none" color="#000" pl="-5rem">
            <Kbd
              display="flex"
              p="0.25rem"
              alignItems={"center"}
              borderBottom={"5px solid #aaa"}
              borderRadius={"10px"}
              userSelect={"none"}
              cursor="pointer"
              _active={{ borderBottom: "0px solid #aaa" }}
              onClick={() => {
                const keywordInput = document.getElementById(
                  "keywordInput"
                ) as HTMLInputElement;
                const value = keywordInput.value;
                if (value.trim() !== "" && !keywords.includes(value)) {
                  const vowelAUM = " ํา".trim();
                  setKeywords((prev) => [
                    ...prev,
                    value.replace("ำ", vowelAUM),
                  ]);
                }
                keywordInput.value = "";
              }}
            >
              Enter <AiOutlineEnter />
            </Kbd>
          </InputRightAddon>
        </InputGroup>

        {keywords.map((i, index) => (
          <HStack key={index}>
            <Badge w="7.5rem" textAlign={"center"} textTransform={"none"}>
              {i}
            </Badge>
            <Badge
              bg="#f005"
              color="#fff"
              _hover={{ bg: "#f00" }}
              transition={"all 0.3s"}
              cursor={"pointer"}
              onClick={() => {
                // delete keyword
                setKeywords(keywords.filter((k) => k !== i));
              }}
            >
              <AiOutlineDelete />
            </Badge>
            <Text>: {extractFromKeyword(i)}</Text>
          </HStack>
        ))}
      </Box>
    </Box>
  );
};

export default ProcessImage;
