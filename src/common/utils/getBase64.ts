import { GetProp, UploadProps } from 'antd/lib';

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function getBase64(
  img: FileType,
  callback: (url: string) => void
) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}
