export  async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {

  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: 'image/jpeg' });
}

export async function fileToDataURL (file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      console.log({e})
      resolve(e.target.result);
    };
    try {
      reader.readAsDataURL(file);
    } catch (e) {
      reject(`image-upload-component: ${e}`);
    }
  });
};

export function convertBytesToMb( bytes: number): number {
  return bytes/1048576;
}
