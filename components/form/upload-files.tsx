"use client";
import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "@uploadthing/react";
import { useCallback, useEffect, useState } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { isImage, safeParseJSON } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { v4 } from "uuid";
import { ClientUploadedFileData } from "uploadthing/types";
import { File as FilePrisma } from "@prisma/client";

const MAX_FILES = 3;

type FileUpload = File & {
  preview: string | undefined;
  id: string;
  status: string;
};
export type InputUploadFile = {
  isPublic?: boolean;
  orgId?: string;
};
interface UploadFilesProps {
  input?: InputUploadFile;
  disabled?: boolean;
  onUploadCompleted: (files: FilePrisma[]) => void;
  mode?: "auto" | "manual";
  setUploading: (value: boolean) => void;
}
export const UploadFiles = ({
  disabled,
  input,
  onUploadCompleted,
  setUploading,
  mode = "auto",
}: UploadFilesProps) => {
  const [files, setFiles] = useState<FileUpload[]>([]);

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing(
    "fileUploader",
    {
      onClientUploadComplete: (
        res: ClientUploadedFileData<{
          uploadedBy: string;
          uploadedFile: string | null;
        }>[]
      ) => {
        const uploadedFiles = res
          .map((item) => {
            const file = safeParseJSON(
              item.serverData.uploadedFile
            ) as FilePrisma;
            if (!file) {
              return null;
            }
            return file;
          })
          .filter((item) => item != null);
        onUploadCompleted(uploadedFiles);
        setUploading(false);
        toast.success("Files uploaded");
        setFiles((prev) => {
          return prev.map((item) =>
            Object.assign(item, {
              status: "uploaded",
            })
          );
        });
      },
      onUploadError: () => {
        setUploading(false);
        toast.error("Fail upload files");
      },
    }
  );
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploading(true);
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: isImage(file.type) ? URL.createObjectURL(file) : undefined,
            id: v4(),
            status: "prepare",
          })
        )
      );
      if (mode === "auto") {
        startUpload(acceptedFiles, input || {});
      }
    },
    [input, startUpload, mode, setUploading]
  );

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () =>
      files.forEach(
        (file) => file.preview && URL.revokeObjectURL(file.preview)
      );
  }, [files]);

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    maxFiles: MAX_FILES,
    disabled: disabled || isUploading,
  });
  const onRemoveFile = (file: FileUpload) => {
    setFiles((prev) => {
      return prev.filter((item) => item.id !== file.id);
    });
  };

  return (
    <section className="w-full">
      <p className="text-xs text-green-500 text-center p-2">
        Max file uploaded at the same time is {MAX_FILES}
      </p>
      <div
        {...getRootProps()}
        className="border flex justify-center items-center h-16 bg-blue-300 rounded-lg"
      >
        <input {...getInputProps()} />
        <p className="p-2 text-center">Drag & drop some files here</p>
      </div>
      <div className="flex justify-center py-2">
        <Carousel className="w-full max-w-md">
          <CarouselContent className="-ml-1">
            {files.length > 0 &&
              files.map((file, index) => {
                return (
                  <CarouselItem className="pl-1 basis-1/3" key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center px-1 relative">
                          {file.status === "uploaded" && (
                            <Button
                              className="absolute right-1 top-1 w-5 h-5 z-50"
                              disabled={disabled || isUploading}
                              variant={"success"}
                              size={"icon"}
                              type="button"
                            >
                              <Check />
                            </Button>
                          )}
                          {file.status === "prepare" && (
                            <Button
                              className="absolute right-1 top-1 w-5 h-5 z-50"
                              disabled={disabled || isUploading}
                              variant={"destroy"}
                              size={"icon"}
                              type="button"
                              onClick={() => onRemoveFile(file)}
                            >
                              <X />
                            </Button>
                          )}
                          {file.preview ? (
                            <Image src={file.preview} alt="Preview" fill />
                          ) : (
                            <div className="flex flex-col justify-end h-full max-w-full">
                              <div className="text-xs text-center text-blue-400 font-semibold w-full line-clamp-1">
                                {file.type}
                              </div>
                              <div className="text-xs text-center text-muted-foreground w-full break-words">
                                {file.name}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
          </CarouselContent>
        </Carousel>
      </div>

      {mode === "manual" && (
        <div className="flex justify-center py-2">
          <Button
            variant={"blue"}
            size={"sm"}
            disabled={disabled || isUploading}
            onClick={() =>
              startUpload(
                files,
                input || {
                  isPublic: false,
                }
              )
            }
          >
            {isUploading ? "Uploading" : "Upload"}
          </Button>
        </div>
      )}
    </section>
  );
};
