import Compressor from "compressorjs";

export const handleImage = async (file, callback ) => {
  const reader = (readFile) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.readAsDataURL(readFile);
    });

  new Compressor(file, {
    quality: 0.8,
    maxWidth: 500,
    maxHeight: 500,
    resize: "contain",
    async success() {
      await reader(file).then((result) => {
        callback({ name: file?.name, url: result });
      });
    },
    error(error) {
      console.error("Error reading file:", error);
    },
  });
};
