import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface Props {
	setCropper: (cropper: Cropper) => void;
	imagePreview: string;
}

const PhotoWidgetCropper = ({ imagePreview, setCropper }: Props) => {
	return (
		<Cropper
			src={imagePreview}
			style={{ height: '200px', width: '100%' }}
			initialAspectRatio={1}
			aspectRatio={1}
			preview='.img-preview'
			guides={false}
			viewMode={1}
			autoCropArea={1}
			background={false}
			onInitialized={(cropper) => setCropper(cropper)}
		/>
	);
};

export default PhotoWidgetCropper;
