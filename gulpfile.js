const gulp = require('gulp')
const through = require('through2');
const mathjax = require('gulp-mathjax-page')
const size = require('gulp-size');
const pangu = require('gulp-pangu');

/* Latex转SVG的任务 */
gulp.task('mathjax', function() {
    gulp.src('./public/**/*.html')
        .pipe(mathjax({
            mjpageConfig: {
                format: ['TeX'],
                singleDollars: true,
                cssInline: false,
                mhchem: {
                    legacy: true
                }
            },
            mjnodeConfig: {
                svg: true,
                css: false,
                speakText: false,
                width: 90
            }
        }))
        .pipe(gulp.dest('./public'))
})
/* 博客加密 */
function Md5(data) {
    /**************************************************
      Author：次碳酸钴（admin@web-tinker.com）
      Input：Uint8Array
      Output：Uint8Array
     **************************************************/
    var i, j, k;
    var tis = [],
        abs = Math.abs,
        sin = Math.sin;
    for (i = 1; i <= 64; i++) tis.push(0x100000000 * abs(sin(i)) | 0);
    var l = ((data.length + 8) >>> 6 << 4) + 15,
        s = new Uint8Array(l << 2);
    s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
    s[data.length >> 2] |= 0x80 << (data.length << 3 & 31);
    s[l - 1] = data.length << 3;
    var params = [
            [function(a, b, c, d, x, s, t) {
                return C(b & c | ~b & d, a, b, x, s, t);
            }, 0, 1, 7, 12, 17, 22],
            [function(a, b, c, d, x, s, t) {
                return C(b & d | c & ~d, a, b, x, s, t);
            }, 1, 5, 5, 9, 14, 20],
            [function(a, b, c, d, x, s, t) {
                return C(b ^ c ^ d, a, b, x, s, t);
            }, 5, 3, 4, 11, 16, 23],
            [function(a, b, c, d, x, s, t) {
                return C(c ^ (b | ~d), a, b, x, s, t);
            }, 0, 7, 6, 10, 15, 21]
        ],
        C = function(q, a, b, x, s, t) {
            return a = a + q + (x | 0) + t, (a << s | a >>> (32 - s)) + b | 0;
        },
        m = [1732584193, -271733879],
        o;
    m.push(~m[0], ~m[1]);
    for (i = 0; i < s.length; i += 16) {
        o = m.slice(0);
        for (k = 0, j = 0; j < 64; j++) m[k & 3] = params[j >> 4][0](
            m[k & 3], m[++k & 3], m[++k & 3], m[++k & 3],
            s[i + (params[j >> 4][1] + params[j >> 4][2] * j) % 16],
            params[j >> 4][3 + j % 4], tis[j]
        );
        for (j = 0; j < 4; j++) m[j] = m[j] + o[j] | 0;
    };
    return new Uint8Array(new Uint32Array(m).buffer);
};

function encodeUTF8(s) {
    var i, r = [],
        c, x;
    for (i = 0; i < s.length; i++)
        if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
        else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
    else {
        if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
            c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
            r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
        else r.push(0xE0 + (c >> 12 & 0xF));
        r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
    };
    return r;
};

function md5(str) {
    var data = new Uint8Array(encodeUTF8(str));
    var result = Md5(data);
    var hex = Array.prototype.map.call(result, function(e) {
        return (e < 16 ? "0" : "") + e.toString(16);
    }).join("");
    return hex;
}
var c2i = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
    'f': 5,
    'g': 6,
    'h': 7,
    'i': 8,
    'j': 9,
    'k': 10,
    'l': 11,
    'm': 12,
    'n': 13,
    'o': 14,
    'p': 15,
    'q': 16,
    'r': 17,
    's': 18,
    't': 19,
    'u': 20,
    'v': 21,
    'w': 22,
    'x': 23,
    'y': 24,
    'z': 25,
    '0': 26,
    '1': 27,
    '2': 28,
    '3': 29,
    '4': 30,
    '5': 31,
    '6': 32,
    '7': 33,
    '8': 34,
    '9': 35,
    '.': 36,
    ',': 37
};
var i2c = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h',
    8: 'i',
    9: 'j',
    10: 'k',
    11: 'l',
    12: 'm',
    13: 'n',
    14: 'o',
    15: 'p',
    16: 'q',
    17: 'r',
    18: 's',
    19: 't',
    20: 'u',
    21: 'v',
    22: 'w',
    23: 'x',
    24: 'y',
    25: 'z',
    26: '0',
    27: '1',
    28: '2',
    29: '3',
    30: '4',
    31: '5',
    32: '6',
    33: '7',
    34: '8',
    35: '9',
    36: '.',
    37: ','
};
var sz = 38;

function encrypt(key, plain) { //加密
    var unicode = "";
    for (var i = 0; i < plain.length; i++) {
        unicode += plain.charCodeAt(i).toString(16);
        unicode += "."; //分隔符
    }
    //console.log("unicode:\n"+unicode);
    var cipher = "";
    for (var i = 0; i < unicode.length; i++) {
        cipher += i2c[(c2i[unicode[i]] + c2i[key[i % key.length]]) % sz];
    }
    return cipher;
}
gulp.task('encrypt', function() {
    gulp.src('./public/**/*.html') //所有html文件
        .pipe(through.obj(function(file, encode, callback) {
            var filestr = file.contents.toString(); //流文件转换为字符串
            var pat = new RegExp("<encrypt[^>]*>[\\s\\S]*?</encrypt>", "g"); //匹配标签的正则表达式
            if (pat.test(filestr)) { //判断是否有需要加密的内容
                //分离加密内容和常规内容
                var enc = filestr.match(pat);
                var oth = filestr.split(pat);

                for (var i = 0; i < enc.length; i++) { //加密
                    //提取密钥
                    var key = enc[i].match(/password=".*"/);
                    if (key == null) key = "."; //默认密钥
                    else key = key[0].replace("password", "").replace(/\"/g, "").replace("=", "");
                    //console.log("The origin key: "+"\033[43m"+key+"\033[0m");

                    //匹配明文
                    var str = enc[i].replace(/<encrypt[^>]*>/, "").replace(/<\/encrypt>/, "");
                    //console.log("\033[42mPlaintext:\n"+str+"\033[0m");

                    //文本加密
                    str = encrypt(key, str);
                    //console.log("\033[44mCiphertext:\n"+str+"\033[0m");

                    //封装标签
                    str = '<div id="encrypted' + i.toString() + '" style="display: none;">' + str + '</div>';
                    str += '<div id="encButton' + i.toString() + '"><p>密钥 <input type="text" id="key' + i.toString() + '" value="."> <input type="submit" value="解密" onclick="decrypt(' + i.toString() + ')"></p></div>'
                    str += '<div id="keyMd5' + i.toString() + '" style="visibility: hidden; ">' + md5(key) + '</div>'
                    enc[i] = str; //替换明文为密文
                    //console.log("\033[44mCiphertext:\n"+str+"\033[0m");
                }
                filestr = "";
                for (var i = 0; i < oth.length; i++) {
                    filestr += oth[i];
                    if (i < enc.length) filestr += enc[i];
                }
                file.contents = Buffer.from(filestr);
            }
            this.push(file);
            callback();
        }))
        .pipe(gulp.dest('./public')); //写入文件
});

gulp.task('pangu', function() {//注意，这是魔改过原js的，不然对md语法不友好
    gulp.src('./source/**/*.md')
    .pipe(pangu())
    .pipe(gulp.dest('./source')); //写入文件
});
