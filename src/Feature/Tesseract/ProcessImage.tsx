/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  HStack,
  Image,
  Input,
  Spinner,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../App/store";
import { tsrAction } from "./tsrSlice";

const ProcessImage = () => {
  const tsr = useSelector((state: RootState) => state.tsr.value);
  const dispatch = useDispatch();
  const [textExtract, setText] = useState("No Image Select");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>();
  const [textShow, setTextShow] = useState("");
  const [lang, setLang] = useState<string[]>(["eng"]);

  const sleep = (s: number) => {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
  };

  const handleImageUpload = async (event: any) => {
    if (lang.length !== 0) {
      setIsLoading(true);
      const imageFile: File = event.target.files[0];
      if (imageFile) {
        setSelectedImage(URL.createObjectURL(imageFile));
        const {
          data: { text },
        } = await Tesseract.recognize(
          imageFile,
          lang as unknown as string
          // { logger: (info) => console.log(info) } // Log for progress
        );
        let modify = "";
        if (lang.includes("tha")) {
          modify = text.split(" ").join("");
        } else {
          modify = text;
        }
        // modify = text;
        // console.log(modify);
        dispatch(tsrAction.setTxtExc(modify));
        setText(modify);
        // setText(text);
      } else {
        dispatch(tsrAction.setTxtExc("No image Select"));
        setText("No image Select");
      }
      setIsLoading(false);
    } else {
      alert("Please Select At Least 1 Language Before Process");
    }
  };

  const showText = async () => {
    const l = textExtract.replace("\n", " ").split("").length;
    // console.log(textExtract.split(""));
    setTextShow("");
    dispatch(tsrAction.setTxtShow(""));
    for (let i = 0; i < l; i++) {
      const old = tsr.textShow;
      setTextShow((prev) => {
        // console.log(prev);
        return prev + textExtract[i];
      });
      dispatch(tsrAction.setTxtShow(old.concat(textExtract[i])));
      await sleep(0.005);
    }
  };

  useEffect(() => {
    console.log(textExtract);
    if (textExtract !== "No Image Select") {
      showText();
    }
  }, [textExtract]);

  useEffect(() => {
    console.log(tsr.textShow);
  }, [tsr.textShow]);

  return (
    <Box>
      <Box w="fit-content">
        <label htmlFor="imageInput">
          <Text
            cursor="pointer"
            border="1px solid #fff"
            w="fit-content"
            p="1rem"
            _hover={{ bg: "#fff3" }}
            transition={"all 0.3s"}
          >
            Select Image
          </Text>
        </label>
        <Input
          type="file"
          display="none"
          id="imageInput"
          accept="image/*"
          onChange={handleImageUpload}
          multiple
        />
      </Box>
      <Box>
        <Text>Add Language Tag</Text>
        <HStack>
          <Text w="2rem">Thai</Text>
          <Switch
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
            defaultChecked={true}
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
      </Box>
      <Box>
        <HStack align={"flex-start"}>
          <Box w="50%">
            <Text>Your Image :</Text>
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
            <Text>Extracted Text :</Text>
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
                <Textarea defaultValue={textShow} w="100%" h="100%" rows={10} />
              )}
            </Box>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};

export default ProcessImage;
