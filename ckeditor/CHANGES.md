# es-ckeditor 4.7.2 （2020-02-26）

this.parts.image.setAttributes
//去掉 /learn

# es-ckeditor 4.7.2-custom-tme-mobile-patch13 (2020-02-20)

- 腾讯音乐富文本手机端因为域名原因，表情图片自动带上了 learn，需要去掉

```js

//plugins/smiley/dialogs/smiley.js

图片data-cke-saved-src 去掉'learn/'

```

# es-ckeditor 4.7.2-custom-tme-mobile-patch12 (2019-07-20)

- 腾讯音乐富文本手机端因为域名原因，显示的图片地址添加 /learn

```js

//plugins/image2/plugin.js

图片src 添加'/learn'路径

```

# es-ckeditor 4.7.2-custom-tme-patch12 (2019-05-23)

- 个人中心编辑器，toolbar 去掉源码

# es-ckeditor 4.7.2-patch11 (2019-02-21)

- 修复图片粘贴或者拖拽时变形的问题

# es-ckeditor 4.7.2-patch9 (2019-02-13)

- 修改黏贴图片上传图片的策略 pasteimage

# es-ckeditor 4.7.2-patch8 (2019-01-29)

- 增加图片通过拖拽或者粘贴板粘贴的功能 pasteimage

# es-ckeditor 4.7.2-patch7 (2018-10-30)

- 将表情图片通过相对路径加载

# es-ckeditor 4.7.2-patch6 (2018-04-24)

- 上传图片高度超过 8000px 对图片进行压缩处理

# es-ckeditor 4.7.2-patch5 (2018-01-23)

- 对上传图片插件添加压缩配置
- 上传图片中的单文件默认限制从 2M 变更成 10M

# es-ckeditor 4.7.2-patch4 (2018-01-18)

- 修复 https 下公式编辑器报错的问题

# es-ckeditor 4.7.2-patch3 (2017-12-26)

- 上传单个文件大小可配置

# es-ckeditor 4.7.2-patch2 (2017-11-01)

- 添加对 flash 的设置
- 添加查找替换功能

# es-ckeditor 4.7.2-patch1 (2017-11-01)

- 添加对文字居中的设置

# es-ckeditor 1.2.2 (2017-09-26)

- 去除编辑器底部信息
- 添加对字体颜色、背景颜色的支持

# es-ckeditor 1.2.1 (2017-09-20)

- 样式优化

# es-ckeditor 1.2.0 (2017-09-15)

- 更新 ckeditor 的版本为 4.7.2
- 适配了 questionblank、uploadpictures、kityformula、shortUrl 等插件
