import markdownit from 'markdown-it';
const md = markdownit()
function renderMD(mdString: string): string {
    return md.render(mdString)
}
export {
    renderMD
}
