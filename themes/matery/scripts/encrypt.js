/* global hexo */
function encrypt (args, content) {
    var psw = args[0];
    if(!psw) psw = ".";
    return '<encrypt password="'+psw+'">\n' + hexo.render.renderSync({text: content, engine: 'markdown'}) + '\n</encrypt>';
}
hexo.extend.tag.register('encrypt', encrypt, {ends: true});
