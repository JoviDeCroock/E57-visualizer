import pye57, json, numpy

data = pye57.E57("./pump.e57")
count = data.scan_count

for i in range(0, count - 1):
  header = data.get_header(i);

  scan = data.read_scan_raw(i);

  print(json.dumps({
    'cartesianX': scan["cartesianX"].tolist(),
    'cartesianY': scan["cartesianY"].tolist(),
    'cartesianZ': scan["cartesianZ"].tolist(),
    'colorRed': scan["colorRed"].tolist(),
    'colorGreen': scan["colorGreen"].tolist(),
    'colorBlue': scan["colorBlue"].tolist(),
  }));
