"use server";

import { Query, ID, InputFile } from "node-appwrite";
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";

// Define your types
type CreateUserParams = {
  email: string;
  phone: string;
  name: string;
};

type RegisterUserParams = {
  identificationDocument?: FormData | null;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: string;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string;
  currentMedication: string;
  familyMedicalHistory: string;
  pastMedicalHistory: string;
  identificationType: string;
  identificationNumber: string;
  treatmentConsent: boolean;
  disclosureConsent: boolean;
  privacyConsent: boolean;
  userId: string;
};

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name);
    return parseStringify(newUser);
  } catch (err: any) {
    if (err && err?.code === 409) {
      const documents = await users.list([
        Query.equal("email", [user.email]),
      ]);
      return documents?.users[0];
    }
    throw err;
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const registerUser = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
  try {
    let file;
    let fileId = null;
    let fileUrl = null;

    // Handle file upload if identificationDocument exists
    if (identificationDocument) {
      console.log("Processing identification document");
      
      const blobFile = identificationDocument.get('blobFile');
      const fileName = identificationDocument.get('fileName');
      
      console.log("Blob file exists:", !!blobFile);
      console.log("File name:", fileName);
      
      if (blobFile && fileName) {
        try {
          // Generate a unique ID for the file
          const uniqueFileId = ID.unique();
          
          // Create the input file from the blob
          const inputFile = InputFile.fromBlob(
            blobFile as Blob,
            fileName as string
          );
          
          console.log("Uploading file to bucket:", BUCKET_ID);
          
          // Upload the file to Appwrite storage
          file = await storage.createFile(
            BUCKET_ID!,
            uniqueFileId,
            inputFile
          );
          
          console.log("File upload successful:", file);
          
          if (file && file.$id) {
            fileId = file.$id;
            fileUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
            console.log("File URL generated:", fileUrl);
          }
        } catch (uploadError) {
          console.error("File upload error:", uploadError);
        }
      }
    }
    
    // Create the patient document
    console.log("Creating patient document with data:", {
      identificationDocumentId: fileId,
      identificationDocumentUrl: fileUrl,
      ...patient
    });
    
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: fileId,
        identificationDocumentUrl: fileUrl,
        ...patient
      }
    );
    
    console.log("Patient registration successful");
    return parseStringify(newPatient);
  } catch (err) {
    console.error("Patient registration error:", err);
    throw err;
  }
};