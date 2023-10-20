export async function template() {
    return await Bun.file("./src/pages/template.html").text();
}