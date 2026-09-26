package com.noboghat.mahi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(LocalFileStorageService.class);
    private final Path fileStorageLocation;

    public LocalFileStorageService() {
        // In a real environment, this might be S3. Here we simulate it locally in an 'uploads' directory
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            // Convert to Base64 to avoid Render's ephemeral disk wipes
            byte[] fileBytes = file.getBytes();
            String base64Encoded = java.util.Base64.getEncoder().encodeToString(fileBytes);
            
            String contentType = file.getContentType();
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            logger.info("Stored file {} as Base64", originalFileName);
            
            return "data:" + contentType + ";base64," + base64Encoded;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }
}
