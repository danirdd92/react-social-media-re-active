import { useEffect, useState } from 'react';
import { Button, Grid, Header, Image } from 'semantic-ui-react';
import PhotoWidgetCropper from './PhotoWidgetCropper';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';

interface Props {
	uploadPhoto: (file: Blob) => void;
	loading: boolean;
}

const PhotoUploadWidget = ({ loading, uploadPhoto }: Props) => {
	const [files, setFiles] = useState<any>([]);
	const [cropper, setCropper] = useState<Cropper>();

	const onCrop = () => {
		if (cropper) {
			cropper.getCroppedCanvas().toBlob((blob) => uploadPhoto(blob!));
		}
	};

	useEffect(() => {
		return () => {
			for (const file of files) {
				URL.revokeObjectURL(file.preview);
			}
		};
	}, [files]);
	return (
		<Grid>
			<Grid.Column width={4}>
				<Header color='teal' content='Step 1 - Add Photo' />
				<PhotoWidgetDropzone setFiles={setFiles} />
			</Grid.Column>

			<Grid.Column width={1} />

			<Grid.Column width={4}>
				<Header color='teal' content='Step 2 - Resize Image' />
				{files && files.length > 0 && <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />}
			</Grid.Column>

			<Grid.Column width={1} />

			<Grid.Column width={4}>
				<Header color='teal' content='Step 3 - Preview & updaload' />
				{files && files.length > 0 && (
					<>
						<div className='img-preview' style={{ minHeight: 200, overflow: 'hidden' }} />
						<Button.Group widths={2}>
							<Button loading={loading} onClick={onCrop} positive icon='check' />
							<Button disabled={loading} onClick={() => setFiles([])} icon='close' />
						</Button.Group>
					</>
				)}
			</Grid.Column>
		</Grid>
	);
};

export default PhotoUploadWidget;
