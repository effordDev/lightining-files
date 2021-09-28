const MIME_LIST = [
	['jpeg', 'image/jpeg'],
	['jpg', 'image/jpeg'],
	['png', 'image/png'],
	['gif', 'image/gif'],
	['pdf', 'application/pdf']
];
const MIME_TYPE_MAP = new Map(MIME_LIST);

export function getMimeTypeFromExtension(extension) {
	return MIME_TYPE_MAP.get(extension);
}