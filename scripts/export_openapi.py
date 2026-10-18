from pathlib import Path
import yaml
from labtrack.api import app

path = Path("contracts/openapi.yaml")
path.parent.mkdir(exist_ok=True)
content = yaml.safe_dump(app.openapi(), sort_keys=False, allow_unicode=True)
# Ensure consistent 422 phrase across Python 3.12 (CI) and Python 3.13+ (Local)
content = content.replace("Unprocessable Content", "Unprocessable Entity")
path.write_text(content, encoding="utf-8")
print(f"Exported {len(app.openapi()['paths'])} API paths")
