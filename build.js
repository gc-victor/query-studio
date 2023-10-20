const entrypoints = [
    './src/pages/login/login.island.tsx',
    './src/pages/home/home.island.ts',
    './dist/styles.css',
];

const result = await Bun.build({
    entrypoints,
    outdir: './dist',
    root: './src',
    target: 'browser',
    naming: {
        entry: '[dir]/[name]-[hash].[ext]',
        chunk: '[name]-[hash].[ext]',
        asset: '[name]-[hash].[ext]',
    },
    minify: true
});

if (!result.success) {
    throw new AggregateError(result.logs, "Build failed");
}

const absolutePath = import.meta.path.replace('build.js', '');

const length = entrypoints.length;
const path = './dist/bundle.json';
await Bun.write(path, JSON.stringify(result.outputs.map(function (output, i) {
    return {
        path: output.path.replace(absolutePath, './'),
        entry: length > i ? entrypoints[i] : "",
        kind: output.kind,
        hash: output.hash,
    };
})));
