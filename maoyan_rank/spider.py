"""爬取猫眼top100电影"""
import requests
from requests.exceptions import RequestException
import re
import json
import datetime

# 请求页面
def request_page(url, headers):
  """请求的时候有可能报错..."""
  try:
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
      return response.text
    return None
  except RequestException:
    return None
  pass

# 解析html
def parse_html(html):
  # re.S标示匹配所有内容
  pattern = re.compile(r'<dd>' +
                        '.*?board-index.*?>(\d+)</i>' +
                        '.*?data-src="(.*?)"' +
                        '.*?name"><a.*?>(.*?)</a>' +
                        '.*?star">(.*?)</p>' +
                        '.*?releasetime">(.*?)</p>' +
                        '.*?integer">(.*?)</i>' +
                        '.*?fraction">(.*?)</i>' +
                        '.*?</dd>', re.S)
  items = re.findall(pattern, html)
  for item in items:
    yield {
      'index': item[0],
      'name': item[2],
      'score': item[5] + item[6],
      'time': item[4][5:],
      'actor': item[3].strip()[3:],
      'cover': item[1],
    }
  pass

# 保存内容至本地
def save_content_to_file(content):
  """中文不转码, 写入utf-8格式"""
  current = datetime.date.today()
  with open('%s-data.txt' % current, 'a', encoding='utf-8') as f:
    f.write(json.dumps(content, ensure_ascii=False))
  display_content = 'rank 名称 分数 时间 演员 封面' + '\n'
  for item in content:
    display_content += '%s %s %s %s %s %s' % (item['index'], item['name'], item['score'], item['time'], item['actor'], item['cover']) + '\n'
  display_f = open('%s.txt' % current, 'w', encoding='utf-8')
  display_f.write(display_content)
  display_f.close()
  pass

def main():
  result = []
  for offset in [i * 10 for i in range(10)]:
    target_url = 'https://maoyan.com/board/4?offset=' + str(offset)
    headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
    }
    html = request_page(target_url, headers)
    for item in parse_html(html):
      result.append(item)
    pass
  save_content_to_file(content=result)
if __name__ == '__main__':
  main()