---
title: Python-Requests库学习
published: 2025-02-06
description: 'Python-Requests库学习笔记'
image: './cover/python-requests.jpg'
tags: []
category: 'Python'
draft: false 
lang: ''
---

# 1 安装 requests 库
打开终端运行：
```python
pip install requests
```
# 2 发送请求
`Requests` 库使得发送 HTTP 请求变得异常简单。无论是发送 GET 请求还是其他类型的请求，都只需几行代码。
```python
import requests

# 发送 GET 请求，
r = requests.get('https://api.github.com/events')

# 发送 POST 请求，常用于提交数据
r = requests.post('http://httpbin.org/post')

# 发送 PUT 请求，通常用于更新资源
r = requests.put('http://httpbin.org/put')

# 发送 DELETE 请求，用于删除资源
r = requests.delete('http://httpbin.org/delete')

# 发送 HEAD 请求，会返回响应头，但不包含响应体，通常用于获取响应的元数据
r = requests.head('http://httpbin.org/get')

# 发送 OPTIONS 请求，用来查看服务器支持哪些 HTTP 方法
r = requests.options('http://httpbin.org/get')
```
# 3 传递 URL参数
在使用 HTTP 请求时，常常需要在 URL 中传递查询参数，`requests` 提供了方便的方式来处理这类需求。
## 3.1 使用 `params` 传递查询参数
如果要将查询参数添加到 URL 中，只需使用 `params` 关键字参数，它接受一个字典，其中的键值对将被编码为查询字符串。
**传递简单的键值对：**
```python
import requests

payload = {'key': 'value', 'user': 'admin'}
r = requests.get("http://httpbin.org/get",params=payload)
print(r.url)
# http://httpbin.org/get?key=value&user=admin
```
**传递包含 `None` 值的参数：**
```python
import requests

payload = {'key1': 'value1', 'key2': None}
r = requests.get('http://httpbin.org/get', params=payload)
print(r.url)  # http://httpbin.org/get?key1=value1

```
## 3.2 传递列表作为参数
也可以将一个列表作为查询参数的值，这样会生成多个相同键的查询参数项。
```python
import requests

payload = {'key1': 'value1', 'key2': ['value2', 'value3']}
r = requests.get('http://httpbin.org/get', params=payload)
print(r.url)  # http://httpbin.org/get?key1=value1&key2=value2&key2=value3

```
# 4 响应内容解析
`Requests` 提供了多种方式来读取服务器返回的数据，包括：
- **文本 (`r.text`)**
- **二进制 (`r.content`)**
- **JSON (`r.json()`)**
- **原始数据流 (`r.raw`)**

| 方法         | 作用           | 适用场景                |
| ---------- | ------------ | ------------------- |
| r.text     | 以 str 形式返回响应 | 文本数据（HTML、XML、JSON） |
| r.encoding | 获取/修改编码      | 服务器返回编码不正确时调整       |
| r.content  | 以 bytes 形式返回 | 图片、视频、二进制文件         |
| r.json()   | 解析 JSON 响应   | API 数据交互            |
| r.raw      | 获取原始 HTTP 响应 | 处理大文件、流式数据          |

## 4.1 获取文本内容
`r.text` 返回的是 **解码后的字符串**，适用于文本数据。
```python
import requests

r = requests.get('https://api.github.com/events')
print(r.text)  # 以文本方式返回响应内容
```
## 4.2 处理编码问题
Requests **自动推测** 服务器返回的编码：
```python
import requests

r = requests.get('https://api.github.com/events')
print(r.encoding)  # 查看默认编码
```
如果编码不正确，可以手动设置：
> 适用于服务器返回错误编码时手动调整。
```python
r.encoding = 'ISO-8859-1'  # 修改编码方式
```
## 4.3 获取二进制内容
`r.content` 适用于：
- **下载图片**
- **音频、视频文件**
- **其他二进制数据**
下载并保存图片：
```python
import requests
from PIL import Image
from io import BytesIO

r = requests.get("https://www.example.com/image.jpg")
image = Image.open(BytesIO(r.content))
image.show()  # 显示图片
image.save("downloaded_image.jpg")  # 保存图片
```
## 4.4 获取JSON 内容
`r.json()` 适用于 **解析 JSON API 响应**。
```python
import requests

r = requests.get('https://api.github.com/events')
data = r.json()
print(data)
print(r.json())
```

> 成功调用 ​ `r.json()` ​ 并**不**意味着响应的成功。有的服务器会在失败的响应中包含一个 JSON 对象（比如 HTTP 500 的错误细节），这种 JSON 会被解码返回。
> 要检查请求是否成功，请使用 ​`r.raise_for_status()`​ 或者检查 ​`r.status_code`​ 是否和你的期望相同。

判断 JSON 响应是否表示请求失败：
```python
if r.status_code == 200:
    print("请求成功")
else:
    print(f"请求失败，状态码：{r.status_code}")
```

`r.raise_for_status()` **可以直接抛出错误**：
```python
import requests

r = requests.get('https://api.github.com/events')
# 返回 http 响应状态码
print(r.status_code) # 200

# 检查 HTTP 响应的状态码是否表示请求失败（即 4xx 或 5xx 错误）
print(r.raise_for_status()) # None
```
## 4.5 获取原始响应数据
在 `requests.get()` 方法中，使用 `stream=True` 参数会以流式传输的方式获取响应内容（来自服务器的原始套接字响应），而不会立即下载整个响应数据。这样可以减少内存占用，适用于处理大文件或数据流。
`r.raw` 适用于：
- **大文件下载**
- **需要直接处理 HTTP 数据流**
```python
import requests

r = requests.get('https://api.github.com/events',stream=True)
# r.raw 是一个 urllib3 的 HTTPResponse 对象
print(r.raw)
# 读取前 10 个字节的数据，返回 `bytes` 类型
print(r.raw.read(10))

# <urllib3.response.HTTPResponse object at 0x00000197A2FD5300>
# b'<!DOCTYPE '
```
正确方式：流式写入文件，避免一次性加载大文件，节省内存！
```python
with open("large_file.bin", "wb") as f:
    for chunk in r.iter_content(chunk_size=1024):  # 每次写入 1KB
        f.write(chunk)
```

# 5 定制请求头
在 `requests` 中，通过 `headers` 参数传递一个字典来添加 HTTP 头部。
使用 `requests` 访问 `httpbin.org/get`（该网站会返回所有请求信息）：
```python
import requests

url = 'https://httpbin.org/get'
# 自定义请求头
headers = {'User-Agent': 'Python'}
# 自定义请求参数
params = {'name': 'python', 'age': 18}
# 发送 GET 请求
r = requests.get(url, params=params,headers=headers)
# 打印服务器返回的请求信息（包括完整的请求头）
print(r.json())
```
发送的请求信息：
```json
{
    "args": {
        "age": "18",
        "name": "python"
    },
    "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Host": "httpbin.org",
        "User-Agent": "Python",
        "X-Amzn-Trace-Id": "Root=1-67a47fdd-15f1a6ec428509c360ddf41c"
    },
    "origin": "159.65.5.218",
    "url": "https://httpbin.org/get?name=python&age=18"
}
```

**优先级注意事项**：
- `.netrc` 中设置的认证信息优先于 `headers` 中的授权信息。
- 重定向时，授权头部会被删除。
- 代理授权头部被 URL 中的代理身份覆盖。
- `Content-Length` 会在内容长度可计算时被改写。
**注意**：所有头部值必须是 `string`, `bytestring` 或 `unicode`，但不建议使用 `unicode`。
# 6 POST 请求
## 6.1 发送表单数据
**application/x-www-form-urlencoded**
```python
import requests

url = "http://httpbin.org/post"
payload = {'key1': 'value1', 'key2': 'value2'}

r = requests.post(url, data=payload)
print(r.json())  # 返回的数据中 "form" 字段包含提交的内容

```
多值表单数据：
```python
payload = (('key1', 'value1'), ('key1', 'value2'))
r = requests.post(url, data=payload)
```
## 6.2 发送 JSON 数据
**application/json**
```python
import requests
import json

url = "https://api.github.com/some/endpoint"
payload = {'some': 'data'}

# 方式 1：手动编码 JSON
r = requests.post(url, data=json.dumps(payload), headers={'Content-Type': 'application/json'})

# 方式 2：自动编码 JSON（推荐）
r = requests.post(url, json=payload)
```
## 6.3 上传文件
**multipart/form-data**
```python
url = "http://httpbin.org/post"
files = {'file': open('report.xls', 'rb')}

r = requests.post(url, files=files)
print(r.json())  # "files" 字段包含上传的文件

```
自定义文件名、MIME 类型/Headers
```python
files = {'file': ('report.xls', open('report.xls', 'rb'), 'application/vnd.ms-excel', {'Expires': '0'})}
r = requests.post(url, files=files)
```
上传文本文件：
```python
files = {'file': ('report.csv', 'some,data,to,send\nanother,row,to,send\n')}
r = requests.post(url, files=files)
```
## 6.4 发送超大文件
默认情况下 `requests` **不支持流式传输大文件**，可以使用 `requests-toolbelt`：
```python
from requests_toolbelt.multipart.encoder import MultipartEncoder

encoder = MultipartEncoder(
    fields={'file': ('large_file.zip', open('large_file.zip', 'rb'), 'application/zip')}
)
headers = {'Content-Type': encoder.content_type}

r = requests.post(url, data=encoder, headers=headers)
```
## 6.5 注意点
1. **建议以二进制模式 (`rb`) 打开文件**，避免 `requests` 计算 `Content-Length` 时出错。
2. `requests.post(url, json=payload)` **自动设置 `Content-Type: application/json`**。
3. `data=` 适用于 **表单数据**，`json=` 适用于 **JSON 数据**。

# 7 响应状态码
- `r.status_code` 获取响应的 HTTP 状态码。
- `requests.codes.ok` 提供了对常见状态码的引用（如 200 OK）。
- `raise_for_status()` 在响应状态码为 4XX 或 5XX 时会抛出 `HTTPError` 异常，可以用来处理错误。
## 7.1 检查状态码
可以通过 `status_code` 属性来检查 HTTP 响应状态码。
```python
import requests

r = requests.get('http://httpbin.org/get')
print(r.status_code)  # 输出 200，表示请求成功
```
## 7.2 使用内置状态码对象
Requests 提供了 `requests.codes`，可以方便地引用常见的 HTTP 状态码：
```python
import requests

r = requests.get('http://httpbin.org/get')
print(r.status_code == requests.codes.ok)  # True，200 OK
```
## 7.3 处理错误响应
当响应状态码表示客户端错误（4XX）或服务器错误（5XX）时，可以使用 `raise_for_status()` 来自动抛出异常：
```python
import requests

bad_r = requests.get('http://httpbin.org/status/404')
print(bad_r.status_code)  # 输出 404

# 抛出异常
bad_r.raise_for_status()
# 会引发 requests.exceptions.HTTPError: 404 Client Error
```
## 7.4 对正常响应调用 `raise_for_status()`
如果响应状态码是 200（即成功），调用 `raise_for_status()` 不会做任何事情：
```python
import requests

r = requests.get('http://httpbin.org/get')
r.raise_for_status()  # 没有异常发生
```
# 8 响应头
- **响应头**: 使用 `r.headers` 获取，返回字典形式的 HTTP 响应头。
- **大小写不敏感**: 可以使用不同的大小写来访问响应头字段。
- **多值字段**: 同名的 HTTP 头部字段会被合并为一个值，用逗号分隔。
## 8.1 查看响应头
可以通过 `r.headers` 查看服务器返回的响应头，它会以一个字典的形式展示：
```python
import requests

r = requests.get('http://httpbin.org/get')
print(r.headers)
```
输出：
```json
{
	'Connection': 'close', 
	'Content-Length': '305', 
	'Access-Control-Allow-Credentials': 'true', 
	'Access-Control-Allow-Origin': '*', 
	'Content-Type': 'application/json', 
	'Date': 'Thu, 06 Feb 2025 09:40:09 GMT', 
	'Server': 'gunicorn/19.9.0'
}
```
## 8.2 访问响应头字段
响应头是大小写不敏感的，可以使用任意大小写形式来访问字段：
```python
import requests

r = requests.get('http://httpbin.org/get')
print(r.headers['Content-Type'])  # 'application/json'
print(r.headers.get('content-type'))  # 'application/json'
```
## 8.3 多值响应头
根据 RFC 7230，HTTP 头部允许同一字段多次出现，服务器会将它们合并：
```python
import requests

# 假设服务器返回的响应头包括多个 'set-cookie'
r = requests.get('http://httpbin.org/cookies/set?name=value')
print(r.headers['set-cookie'])  # 服务器将多个值合并
```
这种合并会将多个字段值用逗号隔开，确保信息语义不变。
# 9 Cookie
- **获取响应 Cookie**: 使用 `r.cookies` 访问返回的 cookies。
- **发送 Cookie**: 使用 `cookies` 参数传递自定义 cookies 给服务器。
- **RequestsCookieJar**: 适用于更复杂的 Cookie 管理，支持跨域名和路径的 Cookie 操作。
## 9.1 获取响应中的 Cookie
通过 `r.cookies` 可以获取服务器返回的 cookies。返回的是一个类似字典的对象：
```python
import requests

url = 'http://example.com/some/cookie/setting/url'
r = requests.get(url)
print(r.cookies['example_cookie_name'])  # 输出 Cookie 值
```
## 9.2 发送 Cookies 到服务器
可以通过 `cookies` 参数将自定义的 cookies 发送给服务器：
```python
import requests

url = 'http://httpbin.org/cookies'
cookies = {'cookies_are': 'working'}

r = requests.get(url, cookies=cookies)
print(r.text)  # 服务器返回的 cookies 信息
```
输出的 cookies 信息：
```json
{
  "cookies": {
    "cookies_are": "working"
  }
}
```
## 9.3 管理 Cookie
`RequestsCookieJar` 提供了更强大的 Cookie 管理功能，可以跨多个域名和路径使用：
```python
import requests

jar = requests.cookies.RequestsCookieJar()
jar.set('tasty_cookie', 'yum', domain='httpbin.org', path='/cookies')
jar.set('gross_cookie', 'blech', domain='httpbin.org', path='/elsewhere')

url = 'http://httpbin.org/cookies'
r = requests.get(url, cookies=jar)
print(r.text)  # 只会返回设置路径 `/cookies` 下的 cookie
```
输出：
```json
{
  "cookies": {
    "tasty_cookie": "yum"
  }
}
```
# 10 重定向与请求历史

| 场景            | 默认行为                  | 结果                               |
| :------------ | :-------------------- | :------------------------------- |
| `GET` 请求      | 自动重定向                 | `r.url` 为最终地址，`r.history` 记录所有跳转 |
| 禁用重定向         | allow_redirects=False | `r.url` 为原始地址，`r.history` 为空     |
| `HEAD` 请求     | 不自动重定向                | `r.history` 为空                   |
| 启用 `HEAD` 重定向 | allow_redirects=True  | `r.history` 记录跳转                 |
如果需要手动处理重定向，可以禁用 `allow_redirects` 并从 `r.headers['Location']` 读取新的 URL 进行处理。

## 10.1 默认的重定向
Requests 默认会自动跟随重定向（除了 `HEAD` 请求）。可以通过 `r.history` 追踪重定向路径：
```python
import requests

r = requests.get('http://github.com')

print(r.url)           # 最终跳转后的 URL
print(r.status_code)   # 最终响应的状态码（如 200）
print(r.history)       # 记录所有重定向响应对象
```
输出：
```
https://github.com/
200
[<Response [301]>]
```
说明：
- `301` 表示 Github 进行了永久重定向（HTTP → HTTPS）。
- `r.history` 记录了 `301` 的响应对象。
## 10.2 禁用自动重定向
如果不想让 Requests 自动跟随重定向，可以设置 `allow_redirects=False`：
```python
r = requests.get('http://github.com', allow_redirects=False)

print(r.status_code)  # 301
print(r.history)      # []
```
说明：`r.status_code` 为 `301`，但 `r.history` 为空，因为没有跟随重定向。
## 10.3 HEAD 请求的重定向
HEAD 请求默认不会跟随重定向，但可以手动启用：
```python
r = requests.head('http://github.com', allow_redirects=True)

print(r.url)        # 'https://github.com/'
print(r.history)    # [<Response [301]>]
```
# 11 超时（timeout）

| 超时类型    | 作用           | 示例                |
| :------ | :----------- | :---------------- |
| 单一超时    | 连接+读取总超时时间   | timeout=5         |
| 连接超时    | 仅限制 TCP 连接时间 | timeout=(3, None) |
| 读取超时    | 服务器响应时间      | timeout=(None, 5) |
| 连接 + 读取 | 连接 3s，读取 5s  | timeout=(3, 5)    |
- 生产环境中**必须**使用 `timeout`，避免程序无限等待。
- **推荐** `timeout=(5, 10)` 作为一般用途的设置。
## 11.1 作用
`timeout` 参数用于设置请求等待服务器响应的超时时间。如果服务器在指定时间内没有响应，则抛出 `requests.exceptions.Timeout` 异常。
## 11.2 使用示例
```python
import requests

try:
    r = requests.get('http://github.com', timeout=0.001)
except requests.exceptions.Timeout:
    print("请求超时！")
```
**说明**：`timeout=0.001` 设置了 1 毫秒的超时时间，因此请求直接超时并抛出异常。

**超时并非请求整个过程的时间**：
- `timeout` **只影响服务器响应的等待时间**，不包括数据传输时间。
- 例如，服务器在 1 秒内响应，但传输数据需要 10 秒，`timeout=2` 仍然不会触发超时异常。
## 11.3 设置超时
可以分别指定**连接超时**和**读取超时**：
```python
requests.get('http://github.com', timeout=(3, 5))
```
- `3` 秒：连接超时时间（建立 TCP 连接的时间）。
- `5` 秒：读取超时时间（等待服务器响应的时间）。

如果所有请求都需要超时，可以使用 `requests.adapters`：
```python
from requests.adapters import HTTPAdapter
from requests.sessions import Session

session = Session()
adapter = HTTPAdapter(max_retries=3)  # 允许最多 3 次重试
session.mount('http://', adapter)
session.mount('https://', adapter)

session.get('http://github.com', timeout=5)
```
# 12 错误与异常处理
- **`raise_for_status()`** 可用于检查响应状态码。
- **网络错误** 用 `ConnectionError` 处理，**超时** 用 `Timeout` 处理。
- **捕获所有异常** 用 `RequestException`，适合用于通用错误处理。
- **推荐** 先处理具体异常（如 `HTTPError`、`Timeout`），再用 `RequestException` 兜底。
## 12.1 常见异常类型

| 异常类型                                 | 触发条件                     | 示例                        |
| :----------------------------------- | :----------------------- | :------------------------ |
| requests.exceptions.ConnectionError  | 网络问题，如 DNS 解析失败、服务器拒绝连接等 | 服务器宕机或域名错误                |
| requests.exceptions.HTTPError        | HTTP 响应状态码为 4xx 或 5xx    | `r.raise_for_status()` 触发 |
| requests.exceptions.Timeout          | 请求超时                     | 服务器未在指定时间内响应              |
| requests.exceptions.TooManyRedirects | 重定向次数超过最大限制              | 发生无限 301/302 循环           |
| requests.exceptions.RequestException | Requests 的基类异常，捕获所有异常    | 适用于通用异常处理                 |
## 12.2 异常处理示例
```python
import requests

url = "http://httpbin.org/status/404"  # 触发 404 错误

try:
    r = requests.get(url, timeout=5)
    r.raise_for_status()  # 检查 HTTP 状态码
except requests.exceptions.ConnectionError:
    print("连接错误，可能是网络问题或服务器宕机！")
except requests.exceptions.HTTPError as err:
    print(f"HTTP 错误: {err}")  # 例如 404、500 等错误
except requests.exceptions.Timeout:
    print("请求超时！")
except requests.exceptions.TooManyRedirects:
    print("重定向次数过多！")
except requests.exceptions.RequestException as e:
    print(f"请求异常: {e}")  # 捕获其他异常
else:
    print("请求成功！")
    print(r.text)

```
## 12.3 处理所有异常
如果只想捕获 `requests` 相关异常，可以使用 `RequestException`：
```python
try:
    r = requests.get(url)
    r.raise_for_status()
except requests.exceptions.RequestException as e:
    print(f"请求失败: {e}")
```
# 13 会话对象 （Session）

| 功能            | 作用                      | 示例                        |
| :------------ | :---------------------- | :------------------------ |
| 共享 `cookie`   | 适用于模拟登录等场景              | s.cookies.set()           |
| 共享 `headers`  | 设置默认 `headers`，减少重复代码   | s.headers.update()        |
| 共享 `auth`     | 适用于 API 认证              | s.auth = ('user', 'pass') |
| 保持 TCP 连接     | 避免每次请求重新建立连接，提升性能       | requests.Session()        |
| 手动管理 `cookie` | 可手动操作 `Session.cookies` | s.cookies.set()           |
| 使用 `with` 语句  | 确保 `Session` 退出时自动释放资源  | with requests.Session() as s:                          |

## 13.1 Session 作用
- **保持 `cookie`**：多个请求之间共享 `cookie`，如模拟用户登录后连续访问页面。
- **减少 TCP 连接**：利用 `urllib3` 的 **连接池**，减少重复建立 HTTP 连接的开销，提高请求效率。
- **共享默认参数**：可以在 `Session` 对象中定义 **默认参数**（如 `headers`、`auth`），避免重复指定。
## 13.2 Session 共享 cookie
使用 `Session` 共享 `cookie`，多个请求间 `cookie` 仍然有效！
```python
import requests

s = requests.Session()

# 设置 Cookie
s.get('http://httpbin.org/cookies/set/sessioncookie/123456789')

# 再次请求，Cookie 依然有效
r = s.get("http://httpbin.org/cookies")

print(r.text)  # {"cookies": {"sessioncookie": "123456789"}}

```

## 13.3 Session 共享 headers
`Session` 默认 `headers` 会与方法级别 `headers` 合并，方法级别 `headers` 具有更高优先级！
```python
import requests

s = requests.Session()
s.headers.update({'User-Agent': 'my-app', 'x-test': 'true'})

# 额外增加一个 `headers`，不会覆盖 `Session` 中的默认值
r = s.get('http://httpbin.org/headers', headers={'x-test2': 'true'})
print(r.json())
```
## 13.4 Session 共享 auth（认证）
`Session` 适用于 API 认证，避免每次都传递 `auth` 参数！
```python
import requests

s = requests.Session()
s.auth = ('user', 'pass')

r = s.get('http://httpbin.org/basic-auth/user/pass')
print(r.status_code)  # 200，认证成功
```

## 13.5 Session 不会自动保留方法级参数
方法级参数（如 `cookies`）仅对当前请求有效，不会影响后续请求！
```python
import requests

s = requests.Session()

# 仅第一个请求携带 cookies
r1 = s.get('http://httpbin.org/cookies', cookies={'from-my': 'browser'})
print(r1.text)  # {"cookies": {"from-my": "browser"}}

# 第二个请求不会携带 cookies（方法级 cookies 不会跨请求共享）
r2 = s.get('http://httpbin.org/cookies')
print(r2.text)  # {"cookies": {}}
```
## 13.6 手动操作 Session.cookies
`Session.cookies.set()` 可以手动添加 `cookie`，适用于模拟登录等场景！
```python
import requests

s.cookies.set('custom_cookie', 'cookie_value', domain='httpbin.org', path='/')

r = s.get("http://httpbin.org/cookies")
print(r.text)  # {"cookies": {"custom_cookie": "cookie_value"}}
```
## 13.7 使用 `with` 语句管理 `Session`
`with` 语句确保 `Session` 退出后自动关闭，避免资源泄露！
```python
import requests

with requests.Session() as s:
    r = s.get('http://httpbin.org/cookies/set/sessioncookie/123456789')
    print(r.status_code)
```
## 13.8 移除 `Session` 默认参数
如果需要在 `Session` 的请求中省略某个默认参数，可以传递 `None`：
```python
import requests

s = requests.Session()
s.headers.update({'User-Agent': 'my-app', 'x-test': 'true'})

# 移除 `x-test`
r = s.get('http://httpbin.org/headers', headers={'x-test': None})
print(r.json())  # "x-test" 被移除
```
# 14 请求与响应对象
使用 `requests` 进行 HTTP 请求时，会涉及两个核心对象：
1. **`Request` 对象**：表示发送给服务器的 HTTP 请求。
2. **`Response` 对象**：表示服务器返回的 HTTP 响应。

| 方法                     | 作用                |
| :--------------------- | :---------------- |
| r.headers              | 获取 **服务器返回** 的响应头 |
| r.request.headers      | 获取 **发送请求时** 的请求头 |
| `r.text` / `r.content` | 获取响应内容（文本 / 字节）   |
| r.json()               | 解析 JSON 响应        |
| r.status_code          | 获取 HTTP 状态码       |
| r.ok                   | 判断请求是否成功          |
| r.url                  | 获取最终请求 URL（考虑重定向） |
| r.history              | 获取请求重定向历史         |
## 14.1 发送请求
`requests.get()` 发送 **GET 请求**，返回一个 `Response` 对象 `r`
```python
import requests

r = requests.get('http://en.wikipedia.org/wiki/Monty_Python')
```
## 14.2 查看服务器返回的 `headers`
**`r.headers` 以字典形式存储 HTTP 响应头！**
- `content-length`：返回数据的大小（字节）。
- `content-encoding`：返回数据的压缩方式（如 `gzip`）。
- `content-type`：返回数据的类型（如 `text/html`）。
- `server`：服务器使用的软件（如 `Apache`）。

```python
import requests

r = requests.get('http://en.wikipedia.org/wiki/Monty_Python')
print(r.headers)
```
输出：
```json
{
    'content-length': '56170',
    'x-content-type-options': 'nosniff',
    'content-encoding': 'gzip',
    'content-language': 'en',
    'server': 'Apache',
    'cache-control': 'private, must-revalidate',
    'content-type': 'text/html; charset=UTF-8'
}
```
## 14.3 查看请求头
`r.request.headers` 获取的是 **发送请求时** 的 `headers`！
- `Accept-Encoding`：请求支持的压缩方式（`gzip`、`deflate`）。
- `Accept`：请求接受的内容类型。
- `User-Agent`：发送请求的客户端信息（默认是 `python-requests`）。
```python
import requests

r = requests.get('http://en.wikipedia.org/wiki/Monty_Python')
print(r.request.headers)
```
输出：
```json
{
	'User-Agent': 'python-requests/2.32.3', 
	'Accept-Encoding': 'gzip, deflate', 
	'Accept': '*/*', 
	'Connection': 'keep-alive'
}
```
## 14.4 获取响应内容
`r.text` 返回 `str`（解码后的文本），`r.content` 返回 `bytes`（原始数据）！
**如果服务器返回 JSON，使用 `r.json()` 直接解析！** 
```python
import requests

r = requests.get('http://en.wikipedia.org/wiki/Monty_Python')
print(r.text)  # 以文本形式返回响应内容
print(r.content)  # 以字节形式返回响应内容
print(r.json())  # 解析 JSON 格式的响应
```
## 14.5 获取状态码
`r.status_code` 可用于判断请求是否成功！ 
`r.ok` 返回 `True` 代表请求成功，`False` 代表失败！
```python
import requests

r = requests.get('http://en.wikipedia.org/wiki/Monty_Python')
print(r.status_code)  # 200 表示请求成功
print(r.ok)  # True 表示请求成功（状态码 200-399）
```
## 14.6 获取最终 URL（考虑重定向）
`r.url` 返回最终的请求 URL，适用于网站重定向！
```python
import requests

r = requests.get('http://en.wikipedia.org/wiki/Monty_Python')
print(r.url)
```
## 14.7 获取请求历史（重定向情况）
**`r.history` 记录了所有重定向的 `Response` 对象！**
- 如果 `r.history` 为空，表示没有发生重定向。
- 如果不想自动跟随重定向，可以使用 `allow_redirects=False`。
```python
import requests

r = requests.get('http://en.wikipedia.org/wiki/Monty_Python')
print(r.history) # [<Response [301]>]
```
# 15 代理设置
对于某些网站，一旦开始大规模、频繁地爬取，网站可能会弹出验证码，或者跳转到登录验证页面，更有甚者可能会直接封禁客户端的IP，导致一定时间内无法访问。为了防止这种情况，需要使用代理来解决这个问题，这就需要用到proxies参数。
## 15.1 设置代理
通过 `proxies` 参数配置代理服务器。可以设置 `http` 和 `https` 协议的代理：
```python
import requests

proxies = {
    'http': 'http://161.35.4.201:80',
    'https': 'https://161.35.4.201:80'
}

try:
    response = requests.get('http://httpbin.org/get', proxies=proxies)
    print(response.text)
except requests.exceptions.ConnectionError as e:
    print('Error', e.args)
```
## 15.2 HTTP Basic Auth
如果代理服务器需要身份验证，可以将用户名和密码嵌入代理 URL 中，格式为 `http://user:password@host:port`：
```python
import requests

proxies = {
    "http": "http://user:password@161.35.4.201:80"
}

r = requests.get("https://www.taobao.com", proxies=proxies)
print(r.text)
```
## 15.3 Socks 5 代理
Requests 也支持 SOCKS 协议的代理，但需要先安装 `socks` 库：`pip3 install 'requests[socks]'`
设置 SOCKS5 代理，支持 `http` 和 `https`：
```python
import requests

proxies = {
    'http': 'socks5://user:password@host:port',
    'https': 'socks5://user:password@host:port'
}

requests.get('https://www.taobao.com', proxies=proxies)
```
# 16 身份验证
访问某网站时，可能会遇到如下的验证页面：
![](assets/P0w3r-20250206193612.png)
## 16.1 HTTP Basic Authentication
使用 `requests.auth.HTTPBasicAuth` 类或者元组，传入用户名和密码进行身份验证：
```python
import requests
from requests.auth import HTTPBasicAuth

# 使用 HTTPBasicAuth 类
r = requests.get('http://localhost:8080/manager/html', auth=HTTPBasicAuth('admin', '123456'))
print(r.status_code)

# 使用元组
r = requests.get('http://localhost:8080/manager/html', auth=('admin', '123456'))
print(r.status_code)
```
## 16.2 OAuth 验证
使用 `requests_oauthlib` 提供的 `OAuth1` 类进行 OAuth 验证
安装请求库：`pip install requests_oauthlib`
```python
import requests from requests_oauthlib 
import OAuth1 
url = 'https://api.twitter.com/1.1/account/verify_credentials.json' 
auth = OAuth1("YOUR_APP_KEY", "YOUR_APP_SECRET", "USER_OAUTH_TOKEN", "USER_OAUTH_TOKEN_SECRET") 
requests.get(url, auth=auth)
```
# 17 PreparedRequest
在 `requests` 库中，**PreparedRequest** （准备好的请求）是一种高级功能，允许你在发送请求之前对请求进行更多的控制和处理。相比直接使用 `requests.get()` 或 `requests.post()`，通过 `PreparedRequest` 你可以更细致地操作请求的内容，特别是当你需要将请求头（headers）、请求体（body）等内容分开处理时。
- **步骤**：
    1. 创建 `Request` 对象并指定请求参数。
    2. 使用 `Session.prepare_request()` 预处理请求（保留会话状态和 cookie）。
    3. 使用 `Session.send()` 发送处理过的请求。
```python
from requests import Request, Session

url = 'http://httpbin.org/post'
data = {'name': 'germey'}
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0'
}

# 创建一个 Session 实例
s = Session()

# 构建 Request 对象，包含 URL、数据和请求头
req = Request('POST', url, data=data, headers=headers)

# 使用 Session 对象将 Request 转换为 PreparedRequest
prepped = s.prepare_request(req)

# 发送请求并获取响应
r = s.send(prepped)

# 输出响应内容
print(r.text)

```
**关键点：**
1. **Request 对象**：构造请求时，首先通过 `Request` 类创建一个请求对象，传入 URL、数据、请求头等参数。
2. **PreparedRequest**：通过 `Session.prepare_request()` 方法将 `Request` 对象转换为 `PreparedRequest`，这时可以对请求做额外处理，比如修改请求体、请求头等。
3. **Session**：`Session` 对象的好处是它能保持会话状态（例如 cookies），并能通过 `send()` 方法发送请求。
# 18 SSL 证书验证
SSL证书验证是确保你访问的网站安全的过程。当你访问一个HTTPS网站时，浏览器或工具会检查网站的SSL证书是否有效，确保你访问的是合法的网站。
- **`verify=True`**：默认验证证书。
- **`verify='/path/to/certfile'`**：自定义证书验证。
- **`verify=False`**：忽略证书验证（不推荐在生产环境使用）。
- **会话保持设置**：使用 `Session` 来保持验证设置。
## 18.1 默认验证（verify=True）
默认情况下，`requests` 会自动验证 SSL 证书。-如果证书验证失败，会抛出 `SSLError` 错误。
```python
requests.get('https://github.com', verify=True)  # 正常访问
```
## 18.2 自定义证书文件
如果有自己的 SSL 证书文件，可以传给 `verify` 参数，进行证书验证：
```python
requests.get('https://github.com', verify='/path/to/certfile')
```
> 如果将 `verify` 设置为文件夹路径，文件夹需通过 OpenSSL 的 `c_rehash` 工具处理。

## 18.3 忽略证书验证
有时可能不想验证 SSL 证书，特别是访问的是测试网站或者自己搭建的服务器时，通过设置 `verify=False`，就可以跳过证书验证：
```python
requests.get('https://kennethreitz.org', verify=False)
```
## 18.4 会话设置
如果需要多次请求相同的服务器，可以用 `Session` 来保持验证设置，避免每次都传递证书：
```python
s = requests.Session()
s.verify = '/path/to/certfile'
```
## 18.5 环境变量
如果有全局的证书信任列表，可以通过设置环境变量 `REQUESTS_CA_BUNDLE` 来让 `requests` 使用：
```bash
export REQUESTS_CA_BUNDLE=/path/to/ca-bundle.crt
```
# 19 证书
## 19.1 客户端证书
一些网站要求你提供证书来证明你的身份。你可以将本地证书传给 `cert` 参数来使用它。
**使用客户端证书**：可以通过 `cert` 参数指定本地证书，支持单个文件或证书与私钥的元组。示例：
```python
requests.get('https://kennethreitz.org', cert=('/path/client.cert', '/path/client.key'))
```
**会话中设置证书**，还可以在会话对象中设置证书。
```python
s = requests.Session()
s.cert = '/path/client.cert'
```
**错误路径或无效证书**：指定错误路径或无效证书会抛出 `SSLError` 错误。示例：
```python
requests.get('https://kennethreitz.org', cert='/wrong_path/client.pem')
```
**私钥要求解密**：私有 key 必须是解密状态，Requests 不支持加密的 key。
## 19.2 CA 证书
**根证书**：Requests 默认会使用一套信任的根证书，确保连接的安全。
**默认根证书**：Requests 默认使用 Mozilla 信任的根证书。
**`certifi` 包**：从 Requests 2.4.0 版本后，若系统装有 `certifi` 包，Requests 会使用它的证书，确保用户可以在不修改代码的情况下更新可信证书。
# 20 巩固练习
## 20.1 传递 URL 参数
**题目1**：如何在 GET 请求中传递多个 URL 参数？
```python
payload = {'key1': 'value1', 'key2': 'value2'}
r = requests.get('http://httpbin.org/get', params=payload)
```
**题目2**：如果参数字典中的某个值为 `None`，该值是否会被包含在 URL 中？
不会，`None` 类型的值不会被添加到 URL 的查询字符串中。
**题目3**：如何传递一个列表作为 URL 参数？
```python
payload = {'key1': 'value1', 'key2': ['value2', 'value3']}
r = requests.get('http://httpbin.org/get', params=payload)
```
## 20.2 定制请求头
**题目1**：如何向请求中添加一个 `User-Agent` 头部？
```python
headers = {'User-Agent': 'my-app/0.0.1'} r = requests.get('https://api.github.com/some/endpoint', headers=headers)
```
**题目2**：如何为一个 POST 请求添加 `Content-Type` 头部？
```python
headers = {'Content-Type': 'application/json'} r = requests.post('https://api.example.com/data', headers=headers, data={'key': 'value'})
```
**题目3**：当你在请求中设置了 `Authorization` 头部时，如何确保它不会被 `.netrc` 中的设置覆盖？
使用 `auth` 参数时，`.netrc` 中的认证信息会被忽略，确保 `Authorization` 头部按照我们手动设置的值进行传递。示例：
```python
headers = {'Authorization': 'Bearer your_token'}
r = requests.get('https://api.example.com/data', headers=headers, auth=('username', 'password'))
```
## 20.3 响应内容
**题目1**：如何访问响应的文本内容？
```python
r.text
```
**题目2**：如何在响应内容中手动设置编码？
```python
r.encoding = 'ISO-8859-1'
```
**题目3**：如何读取响应的二进制数据并保存为文件？
```python
with open('image.jpg', 'wb') as f: 
	f.write(r.content)
```

## 20.4 响应头
**题目1**：如何从响应对象中获取 `Content-Type` 头部信息？
```python
r.headers['Content-Type']
```
**题目2**：如何获取响应头的所有字段并展示它们？
```python
print(r.headers)
```
**题目3**：如何使用 `get()` 方法访问响应头中的 `Content-Encoding` 字段？
```python
r.headers.get('Content-Encoding')
```
## 20.5 请求与响应对象
**题目1**：如何查看发送的请求头部？
```python
r.request.headers
```
**题目2**：如何访问响应的原始内容？
```python
r.raw
```
**题目3**：如何通过 `requests.get()` 获取一个 JSON 格式的响应？
```python
r = requests.get('https://api.github.com/events') 
data = r.json()
```
## 20.6 Cookie
**题目1**：如何通过 `requests.get()` 获取响应中的 cookies？
```python
r.cookies
```
**题目2**：如何发送一个自定义 cookie 到服务器？
```python
cookies = {'my_cookie': 'cookie_value'} r = requests.get('http://httpbin.org/cookies', cookies=cookies)
```
**题目3**：如何为请求手动设置 `requests.cookies.RequestsCookieJar` 并发送？
```python
jar = requests.cookies.RequestsCookieJar() jar.set('cookie_name', 'cookie_value', domain='httpbin.org', path='/') r = requests.get('http://httpbin.org/cookies', cookies=jar)
```
## 20.7 重定向与请求历史
**题目1**：如何查看请求历史中的重定向记录？
```python
r.history
```
**题目2**：如果要禁用请求的重定向，应该怎么做？
```python
r = requests.get('http://github.com', allow_redirects=False)
```
**题目3**：如何获取重定向后的 URL 地址？
```python
r.url
```
## 20.8 Timeout
**题目1**：如何设置请求的超时时间为 2 秒？
```python
r = requests.get('http://github.com', timeout=2)
```
**题目2**：超时发生时，如何捕获 `Timeout` 异常？
```python
try: r = requests.get('http://github.com', timeout=0.001) except requests.exceptions.Timeout: print("请求超时")
```
**题目3**：超时只对哪个过程有效？
超时仅对连接过程有效，不影响响应体的下载。
## 20.9 错误与异常
**题目1**：当 HTTP 状态码不是 2xx 时，如何抛出 `HTTPError` 异常？
```python
r.raise_for_status()
```
**题目2**：如何捕获请求中的 `ConnectionError` 异常？
```python
try: r = requests.get('http://example.com') except requests.exceptions.ConnectionError: print("网络连接错误")
```
**题目3**：如果请求超时，应该捕获哪个异常？
```python
requests.exceptions.Timeout
```
## 20.10 Session
**题目1**：如何创建一个 `Session` 对象并发出一个请求？
```python
s = requests.Session() r = s.get('http://httpbin.org/get')
```
**题目2**：如何在会话中保存登录凭证，并在后续请求中使用？
```python
s = requests.Session() s.auth = ('user', 'password') r = s.get('http://httpbin.org/get')
```
**题目3**：如何确保会话在退出时被关闭？
```python
with requests.Session() as s: s.get('http://httpbin.org/cookies/set/sessioncookie/123456789')
```
## 20.11 代理
**题目 1：** 使用一个代理服务器（`http://123.45.67.89:8080`）发送 GET 请求到 `https://httpbin.org/get`，并打印出服务器返回的内容。
```python
import requests

proxies = {
    'http': 'http://123.45.67.89:8080'
}
response = requests.get('https://httpbin.org/get', proxies=proxies)
print(response.text)
```
**题目 2：** 代理服务器需要用户名和密码验证。代理的地址是 `http://user123:pass123@45.67.89.101:8080`，请使用这个代理访问 `http://httpbin.org/get`，并打印出返回的内容。
```python
import requests

proxies = {
    'http': 'http://user123:pass123@45.67.89.101:8080'
}
response = requests.get('http://httpbin.org/get', proxies=proxies)
print(response.text)
```
**题目 3：** 使用 SOCKS5 代理服务器（`socks5://user:pass@10.0.0.1:1080`）发送一个 GET 请求到 `https://api.github.com/users/octocat`，并将返回的 JSON 数据打印出来。
```python
import requests

proxies = {
    'http': 'socks5://user:pass@10.0.0.1:1080',
    'https': 'socks5://user:pass@10.0.0.1:1080'
}
response = requests.get('https://api.github.com/users/octocat', proxies=proxies)
print(response.json())
```
## 20.12 身份验证
**题目 1：** 使用 HTTP Basic Authentication，访问一个需要认证的页面。已知用户名为 `user`，密码为 `pass`，目标 URL 为 `http://example.com/protected`。请编写代码进行访问，并打印返回的状态码。
```python
import requests
from requests.auth import HTTPBasicAuth

r = requests.get('http://example.com/protected', auth=HTTPBasicAuth('user', 'pass'))
print(r.status_code)
```
**题目 2：** 使用元组形式的 HTTP Basic Authentication 进行身份验证，访问 `http://localhost:5000/dashboard` 页面。假设用户名为 `admin`，密码为 `admin123`，请编写代码并打印响应的内容。
```python
import requests

r = requests.get('http://localhost:5000/dashboard', auth=('admin', 'admin123'))
print(r.text)
```
**题目 3：** 使用 OAuth 1.0 验证方式，访问 Twitter API，目标 URL 为 `https://api.twitter.com/1.1/statuses/home_timeline.json`。请使用以下假设的认证信息：
- 应用密钥： `YOUR_APP_KEY`
- 应用密钥秘钥： `YOUR_APP_SECRET`
- 用户访问令牌： `USER_OAUTH_TOKEN`
- 用户访问令牌秘钥： `USER_OAUTH_TOKEN_SECRET`  ，编写代码并请求该 API。
```python
from requests_oauthlib import OAuth1
import requests

url = 'https://api.twitter.com/1.1/statuses/home_timeline.json'
auth = OAuth1("YOUR_APP_KEY", "YOUR_APP_SECRET", "USER_OAUTH_TOKEN", "USER_OAUTH_TOKEN_SECRET")
r = requests.get(url, auth=auth)
print(r.text)
```
## 20.13 PreparedRequest
**题目 1：** 什么是 `PreparedRequest`，它与 `Request` 对象有什么区别？为什么在某些情况下需要使用 `PreparedRequest`？
`PreparedRequest` 是在发送请求之前将请求的所有组件（如请求头、请求体等）进行处理并准备好发送的请求对象。与 `Request` 类相比，`PreparedRequest` 适用于需要多次发送、修改或者调度的请求，因为它能将请求封装为一个独立的对象。需要使用 `PreparedRequest` 的情况通常是为了能在发送前修改请求或进行一些额外的处理（比如使用队列）。
**题目 2：** 请简述下面的代码流程，并说明如何通过 `PreparedRequest` 向请求中添加查询参数。
```python
from requests import Request, Session

url = 'https://httpbin.org/get'
params = {'key1': 'value1', 'key2': 'value2'}
headers = {'User-Agent': 'my-app/1.0'}
s = Session()
req = Request('GET', url, params=params, headers=headers)
prepped = s.prepare_request(req)
r = s.send(prepped)
print(r.url)
```
代码流程：
- 创建 `Session` 对象。
- 使用 `Request` 构造请求对象，指定请求方法、URL、查询参数和请求头。
- 通过 `Session.prepare_request(req)` 将 `Request` 对象转化为 `PreparedRequest`。
- 使用 `Session.send(prepped)` 发送准备好的请求，并输出请求的完整 URL。
查询参数通过 `params` 参数传入 `Request` 对象，`PreparedRequest` 会自动将其附加到请求 URL 中。
**题目 3：** 你需要发送一个包含 `Authorization` 头和 JSON 格式数据的 `POST` 请求，使用 `PreparedRequest` 来准备请求并发送。请写出完整代码。
```python
from requests import Request, Session
import json

url = 'https://api.example.com/data'
headers = {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
}
data = {'key': 'value'}

# 创建 Session 对象
s = Session()

# 构建 Request 对象
req = Request('POST', url, json=data, headers=headers)

# 准备请求
prepped = s.prepare_request(req)

# 发送请求
r = s.send(prepped)

# 输出响应内容
print(r.status_code)
print(r.text)
```
## 20.14 SSL 证书验证
**题目 1：** 你正在访问一个 HTTPS 网站（例如 `https://example.com`）。如果该网站的 SSL 证书无效，使用 Requests 请求时，会遇到什么错误？并解释如何使用 `verify` 参数来处理这种情况。
如果 SSL 证书无效，Requests 会抛出 `requests.exceptions.SSLError` 错误。可以通过传入正确的证书文件路径或设置 `verify=False` 来避免此错误。
```python
requests.get('https://example.com', verify=True)  # 默认验证，证书无效时会报错
```
**题目 2：** 你访问一个 HTTPS 网站时，证书验证失败，并且你希望忽略证书验证。在 Requests 请求中，应该如何设置 `verify` 参数？请写出示例代码。
要忽略证书验证，可以将 `verify` 参数设置为 `False`。这样，Requests 将不会检查 SSL 证书是否有效。
```python
requests.get('https://example.com', verify=False)  # 忽略证书验证
```
**题目 3：** 你有一个 CA 证书文件 `my_cert.pem`，想要验证访问的 HTTPS 网站的 SSL 证书。在 Requests 请求中，如何使用这个证书文件进行验证？请写出示例代码。
使用 `verify='/path/to/certfile'` 来指定自己的证书文件进行验证。
```python
requests.get('https://example.com', verify='/path/to/my_cert.pem')  # 使用自定义证书
```
## 20.15 证书
**题目 1：** 默认情况下，Requests 如何处理 SSL 证书验证？如果证书验证失败，会发生什么？  
a) 会忽略证书验证  
b) 会抛出 `SSLError`  
c) 会自动重试请求  
d) 会直接跳过请求
**答案：**  
b) 会抛出 `SSLError`

**题目 2：**  如果你想在请求中禁用 SSL 证书验证，应该将 `verify` 参数设置为哪一值？  
a) `verify=True`  
b) `verify=False`  
c) `verify=1`  
d) `verify=disabled`
**答案：**  
b) `verify=False`

**题目 3：**  当使用客户端证书进行请求时，如何传递证书路径和私钥路径？  
a) `cert=('/path/client.cert', '/path/client.key')`  
b) `cert=('/path/client.cert')`  
c) `cert=('/path/client.cert',)`  
d) `cert=('client.cert', 'client.key')`
**答案：**  
a) `cert=('/path/client.cert', '/path/client.key')`
