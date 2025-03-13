import { convertFileToUrl } from '@/lib/utils'
import Image from 'next/image'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

type FileUploaderProps = {
  files: File[] | undefined,
  onchange: (files: File[]) => void
}

const FileUploader = ({ files, onchange }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onchange(acceptedFiles)
  }, [onchange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className="file-upload">
      <input {...getInputProps()} />
      {files && files.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="uploaded image"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            width={40}
            height={40}
            alt="upload"
          />
          <div className="file-upload_label">
            <p className="text-14-regular">
              <span className="text-green-500">Click to upload</span> or drag and drop
            </p>
            <p>SVG, PNG, JPG, GIF up to 10MB</p>
          </div>
        </>
      )}
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  )
}

export default FileUploader