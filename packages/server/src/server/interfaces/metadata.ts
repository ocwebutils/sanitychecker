export default interface UploadMetadata {
	uploadedBy: string;
	ocVersion: string;
	cpuDetails: {
		codename: string;
		name: string;
	};
}
