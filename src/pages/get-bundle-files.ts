import { IS_PRODUCTION } from '../shared.constants';

let bundle: { entry: string; path: string; kind: string; hash: string; }[];

if (IS_PRODUCTION) {
    bundle = await Bun.file('./dist/bundle.json').json();
}

export async function getScripts(dev: string, entry: string) {
    let scripts = `<script src="${dev}" type="module"></script>`;

    if (IS_PRODUCTION) {
        const bundleItem = bundle.filter((f: { entry: string; path: string; kind: string; hash: string; }) => f.entry === entry);

        scripts = bundleItem.length ? `<script src="${bundleItem[0].path.replace('.', '')}" type="module"></script>` : "";
    }

    return scripts;
}

export async function getStyle(dev: string) {
    let link = `<link rel="stylesheet" href="${dev}">`;

    if (IS_PRODUCTION) {
        const assetItem = bundle.filter((f: { entry: string; path: string; kind: string; hash: string; }) => f.kind === 'asset' && f.path.endsWith('.css'));

        link = assetItem.length ? `<link rel="stylesheet" href="${assetItem[0].path.replace('.', '')}">` : "";
    }

    return link;
}
