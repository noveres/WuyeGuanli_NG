package com.example.WuyeGuanli.service;

import com.example.WuyeGuanli.entity.FileNameEntity;
import com.example.WuyeGuanli.repository.FileNameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileNameService {

    private final FileNameRepository fileNameRepository;

    @Autowired
    public FileNameService(FileNameRepository fileNameRepository) {
        this.fileNameRepository = fileNameRepository;
    }

    public void saveFileName(String fileName) {
        FileNameEntity fileNameEntity = new FileNameEntity();
        fileNameEntity.setFileName(fileName);
        fileNameRepository.save(fileNameEntity);
    }
}
