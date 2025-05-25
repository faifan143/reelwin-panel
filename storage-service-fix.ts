// Update your StorageService to handle permission errors gracefully
// Add this to your storage.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  async initializeStorage() {
    try {
      // Your existing initialization code...
      
      // Modified permission checking/setting
      await this.ensureDirectoryPermissions('/var/www/media/radar/videos');
      await this.ensureDirectoryPermissions('/var/www/media/radar/videos/converted');
      
    } catch (error) {
      this.logger.error(`Failed to initialize storage: ${error.message}`);
      // Don't throw error, just log it and continue
      this.logger.warn('Continuing without setting permissions. Manual permission fix required.');
    }
  }

  private async ensureDirectoryPermissions(dirPath: string) {
    try {
      // Create directory if it doesn't exist
      await fs.mkdir(dirPath, { recursive: true });
      
      // Check current permissions
      const stats = await fs.stat(dirPath);
      const currentMode = stats.mode & parseInt('777', 8);
      const expectedMode = parseInt('775', 8);
      
      this.logger.log(`Directory ${dirPath} - Current mode: ${currentMode.toString(8)}`);
      
      if (currentMode !== expectedMode) {
        this.logger.warn(`Directory ${dirPath} does not have correct permissions (expected 775, got ${currentMode.toString(8)})`);
        
        try {
          // Try to fix permissions
          await fs.chmod(dirPath, expectedMode);
          this.logger.log(`Successfully updated permissions for ${dirPath}`);
        } catch (chmodError) {
          this.logger.warn(`Cannot update permissions for ${dirPath}: ${chmodError.message}`);
          this.logger.warn('This is usually not critical for operation if files can still be read/written');
          
          // Test if we can actually write to the directory
          const testFile = path.join(dirPath, '.write-test');
          try {
            await fs.writeFile(testFile, 'test');
            await fs.unlink(testFile);
            this.logger.log(`Directory ${dirPath} is writable despite permission warning`);
          } catch (writeError) {
            this.logger.error(`Directory ${dirPath} is not writable: ${writeError.message}`);
            throw new Error(`Directory ${dirPath} is not accessible for writing`);
          }
        }
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.logger.error(`Directory path does not exist and cannot be created: ${dirPath}`);
      }
      throw error;
    }
  }
}
