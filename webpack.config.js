const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
    entry: './src/app.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },


    devtool: "source-map",

    devServer: {
        contentBase: './dist'
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    mode: 'production',

    module: {
        rules: [

            {test: /\.tsx?$/, loader: "awesome-typescript-loader"},

            {enforce: "pre", test: /\.js$/, loader: "source-map-loader"},
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // 将 JS 字符串生成为 style 节点
                }, {
                    loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
                }, {
                    loader: "sass-loader" // 将 Sass 编译成 CSS
                }]
            },
            /**
             * [path]表示输出文件的相对路径与当前文件相对路径相同
             * 加上[name].[ext]则表示输出文件的名字和扩展名与当前相同
             * 加上[path]这个参数后，打包后文件中引用文件的路径也会加上这个相对路径
             * outputPath表示输出文件路径前缀,(一个保存输出文件的文件夹)
             *  如果你的图片存放在CDN上，那么你上线时可以加上这个参数，值为CDN地址，这样就可以让项目上线后的资源引用路径指向CDN了
             */
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            //limit: 8192,
                            name:'[path][name].[ext]',
                            //outputPath:'img/',
                            //publicPath:'output/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({template: './src/index.html'})
    ]
};

module.exports = config;
