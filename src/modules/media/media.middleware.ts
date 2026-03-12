import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '@/lib/cloudinary';

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (_req, _file) => ({
        folder: 'roommate-app',
        resource_type: 'auto',
    }),
});

const upload = multer({ storage });

export default upload;
