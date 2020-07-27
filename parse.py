import pye57, json, numpy

data = pye57.E57("./pump.e57")
count = data.scan_count;

for i in range(0, count - 1):
  header = data.get_header(i);

  scan = data.read_scan_raw(i);
  scan["cartesianX"] = scan["cartesianX"].tolist()
  scan["cartesianY"] = scan["cartesianY"].tolist()
  scan["cartesianZ"] = scan["cartesianZ"].tolist()
  scan["intensity"] = scan["intensity"].tolist()
  scan["colorRed"] = scan["colorRed"].tolist()
  scan["colorGreen"] = scan["colorGreen"].tolist()
  scan["colorBlue"] = scan["colorBlue"].tolist()
  scan["rowIndex"] = scan["rowIndex"].tolist()
  scan["columnIndex"] = scan["columnIndex"].tolist()
  scan["cartesianInvalidState"] = scan["cartesianInvalidState"].tolist()

  print(json.dumps(scan));

data3d = data.data3d;
