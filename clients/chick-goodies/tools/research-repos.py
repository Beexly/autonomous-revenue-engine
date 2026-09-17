from pathlib import Path
import subprocess,json,concurrent.futures,datetime
R=Path(__file__).resolve().parents[1]/'docs/research/gathering';R.mkdir(parents=True,exist_ok=True)
repos={'dequelabs/axe-core':('adopt','Dev-only browser accessibility gate; no client runtime.'),'microsoft/playwright':('adopt','Route, input, asset, motion and deployed parity tests.'),'dimsemenov/PhotoSwipe':('candidate','Accessible zoom gallery; compare native dialog before adding runtime.'),'darkroomengineering/lenis':('defer','Native scroll preserved; no evidence scroll replacement improves this scene.'),'pmndrs/postprocessing':('defer','Only adopt if an art-directed effect justifies extra render passes.'),'mrdoob/three.js':('adopt-existing','Procedural table scene; measure draw calls, pause and adaptive pixel ratio.'),'theatre-js/theatre':('reference','Timeline tooling not necessary for present short camera path.'),'dimforge/rapier.js':('defer','No collision-based customer interaction yet; physics would add cost without function.')}
def one(pair):
 repo,(verdict,why)=pair
 p=subprocess.run(['gh','api','repos/'+repo],capture_output=True,text=True)
 if p.returncode:return {'repo':repo,'error':p.stderr,'verdict':'unverified'}
 d=json.loads(p.stdout)
 return {'repo':repo,'url':d['html_url'],'stars':d['stargazers_count'],'pushed_at':d['pushed_at'],'archived':d['archived'],'license':(d.get('license') or {}).get('spdx_id'),'verdict':verdict,'reason':why}
data=list(concurrent.futures.ThreadPoolExecutor(max_workers=4).map(one,repos.items()))
(R/'repo-research.json').write_text(json.dumps({'checked_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'count':len(data),'repos':data},indent=2))
print(json.dumps(data,indent=2))
