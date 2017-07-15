import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { APP_SERVE_URL } from '../providers/Constants';
import { FILE_SERVE_URL } from '../providers/Constants';
import { FILE_TOKEN } from '../providers/Constants';
import { HttpService } from '../providers/HttpService';
import { LocalStorage } from '../providers/local-storage';
import { Md5 } from "ts-md5/dist/md5";

@Injectable()
export class initBaseDB {
  db: SQLiteObject;
  basedata: Array<any>;
  constructor(public http: Http, private sqlite: SQLite, public storage: Storage, private sqlitePorter: SQLitePorter, private httpService: HttpService, public localStorage: LocalStorage) {

  }

  currentdb(): SQLiteObject {
    return this.db;
  }

  initdb(dbname: string, createflag: boolean): Promise<any> {
    return new Promise((resolve) => {
      this.sqlite.create({
        name: dbname,
        location: 'default'
      }).then((val: SQLiteObject) => {
        this.db = val;
        resolve(this.db);
        // if (createflag) {
        //   this.httpService.get(APP_SERVE_URL + "/basepack/", { Token: 'AFC5FA4E2E2C4D7F62D8D9EA82DB9A39', projid: '6a397ed5-3923-47e4-8f5a-033920062c02' }).then(res => {
        //     console.log(res);
        //     this.initData(res[0]);
        //   });
        // }
      }).catch(e => console.log(e));
    })
  }

  initData(data, projid): Promise<any> {
    //this.initBaseTable("projver", "Projid,version integer");
    //this.initBaseTable("buildingupdver", "Projid,Building,Batchname,Version integer,Type integer");  
    return new Promise((resolve) => {
      console.log("v1");
      this.existstable("projpositions").then(val => {
        if (val == 0) {
          let promise = new Promise((resolve) => {
            resolve(100);
          });
          resolve(promise.then((v1) => {
            return this.initBaseTable("ProjPositions", "Projid,Id,Name");
          }).then((v2) => {
            return this.initBaseTable("apartments", "Projid,Id,Image,ImgWidth integer");
          }).then((v3) => {
            return this.initBaseTable("apartmentpostionlink", "Projid,Apartmentid,Positionid,Id");
          }).then((v4) => {
            return this.initBaseTable("apartmentpostiondraws", "Apartmentpostionlinkid,X integer,Y integer,Projid");
          }).then((v5) => {
            return this.initBaseTable("projcheckitems", "ProjId,Id,Name");
          }).then((v6) => {
            return this.initBaseTable("projcheckitemdetails", "ProjId,Checkitemid,Name,Timelimit integer,Sortcode integer");
          }).then((v7) => {
            return this.initBaseTable("positioncheckitemlink", "Projid,Positionid,Checkitemid");
          }).then((v8) => {
            return this.initBaseTable("Vend", "Id,NameAlias,Manager,Phone,Projid");
          }).then((v9) => {
            return this.initBaseTable("CustSatisfaction", "Id,Type,Name,Sortcode integer");
          }).then((vv) => {
            return this.initBaseTable("ReasonNoAccepts", "Name");
          }).then((v10) => {
            return this.initBaseTable("imagetable", "projid,fn,src,status integer default 0");   //0 已下载完，1 待上传  2 待删除
          }).catch(err => {
            console.log(err);
          }))
        }
        else {
          let promise = new Promise((resolve) => {
            resolve(100);
          });
          resolve(promise.then((v1) => {
            return this.resetprojdata("projpositions", projid);
          }).then((v2) => {
            console.log("v2");
            return this.resetprojdata("apartments", projid);
          }).then((v3) => {
            console.log("v3");
            return this.resetprojdata("apartmentpostionlink", projid);
          }).then((v4) => {
            console.log("v4");
            return this.resetprojdata("apartmentpostiondraws", projid);
          }).then((v5) => {
            console.log("v5");
            return this.resetprojdata("projcheckitems", projid);
          }).then((v6) => {
            console.log("v6");
            return this.resetprojdata("projcheckitemdetails", projid);
          }).then((v7) => {
            console.log("v7");
            return this.resetprojdata("positioncheckitemlink", projid);
          }).then((v8) => {
            console.log("v8");
            return this.resetprojdata("vend", projid);
          }).then((v9) => {
            return this.resetdata("custsatisfaction");
          }).then((vv) => {
            return this.resetdata("ReasonNoAccepts");
          }).then((v10) => {
            return this.resetprojdata("imagetable", projid);
          }).catch(err => {
            console.log(err);
          }))
          //this.resetprojdata("vendprojcheckscopes", projid);
          //this.resetprojdata("custsatisfaction",projid);                
        }
      })
    })
  }

  initBaseTable(tablename, fields): Promise<any> {
    return new Promise((resolve) => {
      this.db.executeSql("DROP TABLE IF EXISTS " + tablename, []).then(v => {
        this.db.executeSql("CREATE TABLE " + tablename + " (" + fields + ")", []).then(v => {
          resolve(v);
        }).catch(e => {
          console.log(e);
          this.warn('recordcounts:' + e);
        })
      }).catch(e => {
        console.log(e);
        this.warn('recordcounts:' + e);
      })
    })
  }

  initBaseData(tablename, records): Promise<any> {
    return new Promise((resolve) => {
      var json = {};
      json = { "data": { "inserts": { [tablename]: records } } };
      console.log(tablename); console.log(records);
      this.sqlitePorter.importJsonToDb(this.db, json).then(val => {
        console.log(val);
        this.db.executeSql("SELECT * FROM " + tablename, []).then(vres => {   //SELECT count(*) as counts FROM
          for (var i = 0; i < vres.rows.length; i++) {
            console.log(JSON.stringify(vres.rows.item(i)));
          }
          //alert('Transaction finished, check record count: ' + tablename + "   " + JSON.stringify(vres.rows.item(0)));
          resolve(1);//vres.rows.item(0).counts);
        }).catch(err => {
          this.warn(tablename + ":" + err);
        })
      }).catch(e => {
        console.log(tablename + 'error');
        console.log('Transaction error: ' + e.message);
        alert('Transaction error: ' + e.message);
      })
    })
  }

  recordcounts(tablename): Promise<any> {
    return new Promise((resolve) => {
      this.db.executeSql("SELECT count(*) FROM " + tablename, []).then(vres => {
        console.log('Transaction finished, check record count: ' + tablename + "   " + JSON.stringify(vres.rows.item(0)));
        resolve(vres.rows.item(0));
      }).catch(e => {
        console.log(e);
        this.warn('recordcounts:' + e);
      })
    })
  }

  initProjVersion(token): Promise<any> {
    return new Promise((resolve) => {
      this.httpService.get(APP_SERVE_URL + "/ProjectVersion", { Token: token }).then(res => {
        console.log(res);
        let items: Array<any>;
        items = res[0];
        console.log(items);
        this.existstable("ProjVersion").then(counts => {
          console.log(counts);
          if (counts == 0) {
            let promise = new Promise((resolve) => {
              resolve(100);
            });
            resolve(promise.then((v1) => {
              return this.initBaseTable("ProjVersion", "Projid,VersionId integer,ProjName,Needupd integer");
            }).then((v2) => {
              return this.initBaseData("ProjVersion", items[2]);
            }).then((v3) => {
              return this.db.executeSql("update ProjVersion set needupd = 1", []);
            }).then((v4) => {
              return this.setcurproj(token);
            }).catch(err => {
              console.log(err);
            }))
          }
          else {
            let promise = new Promise((resolve) => {
              resolve(100);
            });
            resolve(promise.then((v1) => {
              return this.initBaseTable("tmpprojversion", "Projid,VersionId integer,ProjName,Needupd integer");
            }).then((v2) => {
              return this.initBaseData("tmpprojversion", items[2]);
            }).then((v3) => {
              return this.db.executeSql("delete from ProjVersion where ProjId not in (select projid from tmpprojversion)", []);
            }).then((v4) => {
              return this.db.executeSql("update ProjVersion set needupd = 1 where exists(select * from tmpprojversion where tmpprojversion.projid = ProjVersion.projid and tmpprojversion.versionid != ProjVersion.versionid)", []);
            }).then((v5) => {
              return this.db.executeSql("insert into ProjVersion (Projid,ProjName,VersionId,needupd) select Projid,ProjName,VersionId,1 from tmpprojversion where tmpprojversion.projid not in (select projid from ProjVersion)", []);
            }).then((v6) => {
              return this.setcurproj(token);
            }).catch(err => {
              console.log(err);
            }))
          }
        })
      })
    })
  }

  resetprojdata(tablename, projid): Promise<any> {
    return this.db.executeSql("delete from " + tablename + " where ProjId = '" + projid + "'", []);

  }

  resetdata(tablename): Promise<any> {
    return this.db.executeSql("delete from " + tablename, []);

  }

  resetbatchbuildingdata(tablename, projid, batchid, buildingid): Promise<any> {
    let sql = "delete from #tablename# where ProjId = '#projid#' and Batchid = '#batchid#' and Buildingid = '#buildingid#'";
    sql = sql.replace('#tablename#', tablename);
    sql = sql.replace('#projid#', projid);
    sql = sql.replace('#batchid#', batchid);
    sql = sql.replace('#buildingid#', buildingid);
    return this.db.executeSql(sql, []);
  }

  resetbuildingdata(tablename, projid, buildingid): Promise<any> {
    let sql = "delete from #tablename# where ProjId = '#projid#' and Buildingid = '#buildingid#'";
    sql = sql.replace('#tablename#', tablename);
    sql = sql.replace('#projid#', projid);
    sql = sql.replace('#buildingid#', buildingid);
    return this.db.executeSql(sql, []);

  }

  setcurproj(token): Promise<any> {
    return new Promise((resolve) => {
      var projid: string;
      console.log("setcurproj");
      this.localStorage.getItem('curproj').then(val => {
        console.log(val);
        if (val == null) {
          this.db.executeSql("SELECT Projid,ProjName,VersionId,Needupd FROM ProjVersion order by versionid", []).then(v2 => {
            projid = v2.rows.item(0).Projid;
            console.log(projid);
            this.localStorage.setItem('curproj', { projid: v2.rows.item(0).Projid, projname: v2.rows.item(0).ProjName, versionid: v2.rows.item(0).VersionId, needupd: v2.rows.item(0).Needupd }).then(v => {
              this.updatecurproj(token).then(v => {
                console.log("v");
                console.log(v);
                console.log(projid);
                resolve(projid);
              })
            })
          }).catch(e => {
            alert("项目加载错误：" + JSON.stringify(e));
          })
        }
        else {
          this.db.executeSql("SELECT Projid,ProjName,VersionId,needupd FROM ProjVersion where ProjVersion.projid = '" + val.projid + "'", []).then(v => {
            if (v.rows.item(0).Projid == '') {
              this.db.executeSql("SELECT Projid,ProjName,VersionId,Needupd FROM ProjVersion", []).then(v2 => {
                projid = v2.rows.item(0).Projid;
                this.localStorage.setItem('curproj', { projid: v2.rows.item(0).Projid, projname: v2.rows.item(0).ProjName, versionid: v2.rows.item(0).VersionId, needupd: v2.rows.item(0).Needupd }).then(v => {
                  this.updatecurproj(token).then(v => {
                    console.log("v");
                    console.log(v);
                    console.log(projid);
                    resolve(projid);
                  })
                })
              }).catch(e => {
                alert("项目加载错误：" + JSON.stringify(e));
              })
            }
            else {
              projid = v.rows.item(0).Projid;
              this.localStorage.setItem('curproj', { projid: v.rows.item(0).Projid, projname: v.rows.item(0).ProjName, versionid: v.rows.item(0).VersionId, needupd: v.rows.item(0).Needupd }).then(v => {
                this.updatecurproj(token).then(v => {
                  console.log("v");
                  console.log(v);
                  console.log(projid);
                  resolve(projid);
                })

              })
            }
          }).catch(e => {
            alert("项目加载错误：" + JSON.stringify(e));
          })
        }
      })
    })
  }

  updatecurproj(token): Promise<any> {
    return new Promise((resolve) => {
      console.log('updatecurproj');
      this.localStorage.getItem('curproj').then(v => {
        console.log(v);
        if (v.needupd == 1) {
          this.httpService.get(APP_SERVE_URL + "/basepack/", { Token: token, Projid: v.projid }).then(res => {
            console.log(res[0]);
            this.initData(res[0], v.projid).then(val => {
              let data: Array<any>;
              data = res[0];
              for (var i = 2; i < data.length; i += 2) {
                let items = data[i];
                console.log(items[0]);
                if (data[i + 1].length > 0) {
                  this.initBaseData(items[0], data[i + 1]);
                }
              }
              console.log(res[0][1][0]);
              this.db.executeSql("update ProjVersion set needupd = 0, versionid = " + res[0][1][0] + " where projid = '" + v.projid + "'", []).then(v2 => {
                resolve(this.localStorage.setItem('curproj', { projid: v.projid, projname: v.projname, versionid: res[0][1][0], needupd: 0 }));
              })
            })
          });
        }
        else {
          resolve(1);
        }
      })
    })
  }

  checkandupdprojversion(projid, token, versionid: number): Promise<any> {
    return new Promise((resolve) => {
      this.httpService.get(APP_SERVE_URL + "/ProjectVersion", { Token: token, ProjId: projid }).then(res => {
        let items: Array<any>;
        items = res[0];
        console.log(items);
        let item: Array<any>;
        item = items[2];
        console.log(item);
        if (item[0].versionid != versionid) {
          this.localStorage.getItem('curproj').then(v => {
            let promise = new Promise((resolve) => {
              resolve(100);
            });
            resolve(promise.then((v1) => {
              return this.db.executeSql("update ProjVersion set needupd = 1 where projid = '" + projid + "'", []);
            }).then((v2) => {
              return this.localStorage.setItem('curproj', { projid: v.projid, projname: v.projname, versionid: v.versionid, needupd: 1 });
            }).then((v3) => {
              return this.updatecurproj(token);
            }).catch(err => {
              console.log(err);
            }))
          })
        }
        else {
          resolve(1);
        }
      })
    })
  }

  initbuildingversion(token, projid): Promise<any> {
    return new Promise((resolve) => {
      console.log('initbuilding');
      this.httpService.get(APP_SERVE_URL + "/BuildingVersion", { Token: token, ProjId: projid }).then(res => {
        console.log(res);
        let items: Array<any>;
        items = res[0];
        console.log(items);
        this.existstable("buildingversion").then(counts => {
          if (counts == 0) {
            let promise = new Promise((resolve) => {
              resolve(100);
            });
            resolve(promise.then((v1) => {
              return this.initBaseTable("buildingversion", "Projid,Buildingid,BuildingName,Batchid,VersionId integer,Type integer,BatchName,downloadversionId integer,needupd integer,needdownload integer,needupload integer");
            }).then((v2) => {
              return this.initBaseData("buildingversion", items[2]);//items[2]);
            }).then((v3) => {
              return this.db.executeSql("update buildingversion set needupd = 1, needdownload = 1, versionid = 0", []);
            }).then((v4) => {
              return this.initBaseTable("uplimagetable", "Projid,Buildingid,Batchid,fn");
            }).catch(err => {
              console.log(err);
            }))
          }
          else {
            let promise = new Promise((resolve) => {
              resolve(100);
            });
            resolve(promise.then((v1) => {
              return this.initBaseTable("tmpbuildingversion", "Projid,Buildingid,BuildingName,Batchid,VersionId integer,Type integer,BatchName,downloadversionId integer,needupd integer,needdownload integer,needupload integer");
            }).then((v2) => {
              return this.initBaseData("tmpbuildingversion", items[2]);//items[2]);
            }).then((v3) => {
              let sql = "delete from buildingversion where not exists (select tb.ProjId from tmpbuildingversion tb where tb.projid = buildingversion.projid and tb.batchid = buildingversion.batchid and tb.buildingid = buildingversion.buildingid ) and projid = '" + projid + "'";
              console.log(sql);
              return this.db.executeSql(sql, []);
            }).then((v4) => {
              console.log("v4");
              return this.db.executeSql("update buildingversion set needupd = 1 where exists(select * from tmpbuildingversion where buildingversion.projid = tmpbuildingversion.projid and buildingversion.buildingid = tmpbuildingversion.buildingid and buildingversion.batchid = tmpbuildingversion.batchid and buildingversion.versionid != tmpbuildingversion.versionid)", []);
            }).then((v5) => {
              console.log("v5");
              return this.db.executeSql("update buildingversion set needdownload = 1 from buildingversion inner join tmpbuildingversion on buildingversion.projid = tmpbuildingversion.projid and buildingversion.buildingid = tmpbuildingversion.buildingid and buildingversion.batchid = tmpbuildingversion.batchid and buildingversion.downloadversionId != tmpbuildingversion.downloadversionId", []);
            }).then((v6) => {
              console.log("v6");
              return this.db.executeSql("insert into buildingversion (Projid,Buildingid,BuildingName,Batchid,BatchName,Type,VersionId,needupd,downloadversionId,needdownload) select Projid,Buildingid,BuildingName,Batchid,BatchName,Type,VersionId,1,downloadversionId,1 from tmpbuildingversion where not exists (select projid from buildingversion where buildingversion.projid=tmpbuildingversion.projid and buildingversion.buildingid = tmpbuildingversion.buildingid and buildingversion.batchid = tmpbuildingversion.batchid and buildingversion.projid = '" + projid + "')", []);
            }).catch(err => {
              console.log(err);
            }))
          }
        })
      })
    })
  }

  initbuildingbaseData(data, projid, batchid, buildingid, type): Promise<any> {
    return new Promise((resolve) => {
      for (var i = 2; i < data.length; i += 2) {
        let items = data[i];
        console.log(items[0]);
        if (data[i + 1].length > 0) {
          this.initBaseData(items[0], data[i + 1]);
        }
      }
      console.log(data[1][0]);
      let sql = "update buildingversion set needdownload = 0,downloadversionId = #version# where projid = '#projid#' and batchid = '#batchid#' and buildingid = '#buildingid#' and type = #type#";
      sql = sql.replace('#projid#', projid);
      sql = sql.replace('#batchid#', batchid);
      sql = sql.replace('#buildingid#', buildingid);
      sql = sql.replace('#type#', type);
      sql = sql.replace('#version#', data[1][0]);
      console.log('initbudata:' + sql);
      this.db.executeSql(sql, []).then(v => {
        console.log(v)
        resolve(1);
      })
    })
  }

  initformalcheckbaseTable(token, projid, batchid, buildingid): Promise<any> {
    return new Promise((resolve) => {
      this.httpService.get(APP_SERVE_URL + "/BasePack/GetFormalCheck", { Token: token, ProjId: projid, Batchid: batchid, buildingid: buildingid }).then(res => {
        let items: Array<any>;
        items = res[0];
        console.log(items);
        this.existstable("FormalCheckBatchRooms").then(counts => {
          if (counts == 0) {
            let promise = new Promise((resolve) => {
              resolve(100);
            });
            resolve(promise.then((v1) => {
              return this.initBaseTable("FormalCheckBatchRooms", "ID,BatchId,RoomId,ProjId,Buildingid"); //////////////核对
            }).then((v2) => {
              return this.initBaseTable("Rooms", "ProjId,Buildingid,FloorId,Id,Name,Unit,ApartmentId,SortCode");
            }).then((v3) => {
              return this.initBaseTable("Vendprojcheckscopes", "VendId,ProjId,ProjCheckItemId,RoomId,BuildingId");
            }).then((v5) => {
              return this.initbuildingbaseData(res[0], projid, batchid, buildingid, 3);
            }).then((v6) => {
              return this.initApartImage(projid, buildingid);
            }).then((v7) => {
              return this.initBaseTable("FormalCheckIssues", "BatchId,IssueId default '',RoomId,PositionId,CheckItemId,PlusDesc default '',IssueDesc default '',UrgencyId default '',ImgBefore1 default '',ImgBefore2 default '',ImgBefore3 default '',ImgAfter1 default '',ImgAfter2 default '',ImgAfter3 default '',Id primary key,IssueStatus,VendId default '',ResponVendId default '',ProjId default '',Manager default '',ResponsibleId default '',IssueType default '',RegisterDate datetime default '1753-01-01 00:00:00',AppointDate datetime default '1753-01-01 12:00:00',LimitDate datetime default '1753-01-01 12:00:00',ReFormDate datetime default '1753-01-01 12:00:00',CloseDate datetime default '1753-01-01 12:00:00',CloseReason default '',CancelDate datetime default '1753-01-01 12:00:00',CancelReason defalut '',VersionId integer,ImgClose1 default '',ImgClose2 default '',ImgClose3 default '',ReturnDate datetime default '1753-01-01 12:00:00',ReturnReason default '',ReturnNum integer default 0 ,BuildingId default '',EngineerId default '',ReviewDate datetime default '1753-01-01 12:00:00',x integer default 0,y integer default 0,ResponsibleName default '',ResponsiblePhone default '',EngineerName default '',EngineerPhone default ''");
            }).then((v8) => {
              return this.initBaseTable("tmpFormalCheckIssues", "BatchId,IssueId default '',RoomId,PositionId,CheckItemId,PlusDesc default '',IssueDesc default '',UrgencyId default '',ImgBefore1 default '',ImgBefore2 default '',ImgBefore3 default '',ImgAfter1 default '',ImgAfter2 default '',ImgAfter3 default '',Id primary key,IssueStatus,VendId default '',ResponVendId default '',ProjId default '',Manager default '',ResponsibleId default '',IssueType default '',RegisterDate datetime default '1753-01-01 00:00:00',AppointDate datetime default '1753-01-01 12:00:00',LimitDate datetime default '1753-01-01 12:00:00',ReFormDate datetime default '1753-01-01 12:00:00',CloseDate datetime default '1753-01-01 12:00:00',CloseReason default '',CancelDate datetime default '1753-01-01 12:00:00',CancelReason defalut '',VersionId integer,ImgClose1 default '',ImgClose2 default '',ImgClose3 default '',ReturnDate datetime default '1753-01-01 12:00:00',ReturnReason default '',ReturnNum integer default 0,BuildingId default '',EngineerId default '',ReviewDate datetime default '1753-01-01 12:00:00',x integer default 0,y integer default 0,ResponsibleName default '',ResponsiblePhone default '',EngineerName default '',EngineerPhone default ''");
            }).then((v8) => {
              return this.initBaseTable("uplFormalCheckIssues", "BatchId,IssueId default '',RoomId,PositionId,CheckItemId,PlusDesc default '',IssueDesc default '',UrgencyId default '',ImgBefore1 default '',ImgBefore2 default '',ImgBefore3 default '',ImgAfter1 default '',ImgAfter2 default '',ImgAfter3 default '',Id primary key,IssueStatus,VendId default '',ResponVendId default '',ProjId default '',Manager default '',ResponsibleId default '',IssueType default '',RegisterDate datetime default '1753-01-01 00:00:00',AppointDate datetime default '1753-01-01 12:00:00',LimitDate datetime default '1753-01-01 12:00:00',ReFormDate datetime default '1753-01-01 12:00:00',CloseDate datetime default '1753-01-01 12:00:00',CloseReason default '',CancelDate datetime default '1753-01-01 12:00:00',CancelReason defalut '',VersionId integer,ImgClose1 default '',ImgClose2 default '',ImgClose3 default '',ReturnDate datetime default '1753-01-01 12:00:00',ReturnReason default '',ReturnNum integer default 0,BuildingId default '',EngineerId default '',ReviewDate datetime default '1753-01-01 12:00:00',x integer default 0,y integer default 0,ResponsibleName default '',ResponsiblePhone default '',EngineerName default '',EngineerPhone default ''");
            }).then((v9) => {
              return this.initBaseTable("CustRoomSatisfactions", "RoomId,SatisfiedDim,HousingType,Score integer default 5,ProjId,VersionId integer,Id,BatchId,Buildingid");
            }).then((v10) => {
              return this.initBaseTable("tmpCustRoomSatisfactions", "RoomId,SatisfiedDim,HousingType,Score integer default 5,ProjId,VersionId integer,Id,BatchId,Buildingid");
            }).then((v11) => {
              return this.initBaseTable("RoomNoAcceptLogs", "ProjId,RoomId,PlusDesc,VersionId,ID,ReasonNoAcceptId,BatchId,Buildingid,UserName,TransDate");
            }).then((v12) => {
              return this.initBaseTable("tmpRoomNoAcceptLogs", "ProjId,RoomId,PlusDesc,VersionId,ID,ReasonNoAcceptId,BatchId,Buildingid,UserName,TransDate");
            }).then((v13) => {
              return this.initBaseTable("FormalRoomDetails", "RoomId,TransDate DateTime default '1753-01-01 12:00:00',RoomStatus,CustId,CustPhone,Remark,EngineerId,EngineerPhone,ImgSign,ProjId,VersionId integer,ID,AmmeterNumber,AmmeterReading real default 0,WaterMeterNumber,WaterMeterReading real default 0,GasMeterNumber,GasMeterReading real default 0,KeyRetentionStatus integer default 0,BatchId,BuildingId,EngineerName");
            }).then((v14) => {
              return this.initBaseTable("tmpFormalRoomDetails", "RoomId,TransDate DateTime default '1753-01-01 12:00:00',RoomStatus,CustId,CustPhone,Remark,EngineerId,EngineerPhone,ImgSign,ProjId,VersionId integer,ID,AmmeterNumber,AmmeterReading real default 0,WaterMeterNumber,WaterMeterReading real default 0,GasMeterNumber,GasMeterReading real default 0,KeyRetentionStatus integer default 0,BatchId,BuildingId,EngineerName");
            }).catch(err => {
              console.log(err);
            }))
          }
          else {
            let promise = new Promise((resolve) => {
              resolve(100);
            });
            resolve(promise.then((v1) => {
              return this.resetbatchbuildingdata("FormalCheckBatchRooms", projid, batchid, buildingid);
            }).then((v2) => {
              console.log("v2");
              return this.resetbuildingdata("Rooms", projid, buildingid);
            }).then((v3) => {
              console.log("v3");
              return this.resetbuildingdata("Vendprojcheckscopes", projid, buildingid);
            }).then((v5) => {
              return this.initbuildingbaseData(res[0], projid, batchid, buildingid, 3);
            }).then((v6) => {
              return this.initApartImage(projid, buildingid);
            }).catch(err => {
              console.log(err);
            }))
          }
        })
      })
    })
  }

  initApartImage(projid, buildingid): Promise<any> {
    return new Promise((resolve) => {
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      console.log('image');
      resolve(promise.then((v1) => {
        let sql = "select image from apartments where Projid = '#projid#' and exists(select rooms.ApartmentId from rooms where projid = '#projid#' and buildingid = '#buildingid#' and rooms.ApartmentId = apartments.id) and image not in (select fn from imagetable where projid = '#projid#')";
        sql = sql.replace('#projid#', projid); sql = sql.replace('#projid#', projid); sql = sql.replace('#projid#', projid);
        sql = sql.replace('#buildingid#', buildingid);
        return this.db.executeSql(sql, []);
      }).then((v2: any) => {
        let tmppromise = Promise.resolve([]);
        for (var i = 0; i < v2.rows.length; i++) {
          console.log(JSON.stringify(v2.rows.item(i)));
          let fn = v2.rows.item(i).Image;
          tmppromise = tmppromise.then(() => {
            return this.downloadimg(fn);
          }).then(val => {
            let sql = "insert into imagetable (projid,fn,src) values('" + projid + "','" + fn + "','" + val + "')";
            //console.log(sql);
            return this.db.executeSql(sql, []);
          })
        }
        return tmppromise;
      }).catch(err => {
        console.log(err);
      }))
    })
  }

  downloadbuildinginfo(token, projid, batchid, buildingid, type): Promise<any> {
    return new Promise((resolve) => {
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      resolve(promise.then((v1) => {
        console.log('downloadbuildinginfo:v1 :' + v1);
        return this.initformalcheckbaseTable(token, projid, batchid, buildingid);
      }).then((v2) => {
        console.log('downloadbuildinginfo:v2 :' + v2);
        return this.updatebuildinginfo(token, projid, batchid, buildingid, type);
      }).catch(err => {
        console.log("楼栋下载失败:" + err);
      }))
    })
  }

  uploaddata(projid, batchid, buildingid, tablenames: Array<string>): Promise<any> {
    return new Promise((resolve) => {
      console.log('uploaddata');
      let jsonarr: Array<any>; jsonarr = [];
      let tmppromise = Promise.resolve([]);
      console.log(tablenames);
      for (var i = 0; i < tablenames.length; i++) {
        let tablename = tablenames[i];
        console.log(tablename);
        tmppromise = tmppromise.then(() => {
          let sql: string;
          console.log(tablename + ";" + i);
          if (tablename == "FormalCheckIssues") {
            sql = "select * from #tablename# where projid = '#projid#' and batchid = '#batchid#' and buildingid = '#buildingid#' and versionid = 0 Union all select * from upl#tablename# where projid = '#projid#' and batchid = '#batchid#' and buildingid = '#buildingid#'";
            sql = sql.replace('#tablename#', tablename).replace('#tablename#', tablename);
            sql = sql.replace('#projid#', projid).replace('#projid#', projid);
            sql = sql.replace('#batchid#', batchid).replace('#batchid#', batchid);
            sql = sql.replace('#buildingid#', buildingid).replace('#buildingid#', buildingid);
          } else {
            sql = "select * from #tablename# where projid = '#projid#' and batchid = '#batchid#' and buildingid = '#buildingid#' and versionid = 0 ";
            sql = sql.replace('#tablename#', tablename);
            sql = sql.replace('#projid#', projid);
            sql = sql.replace('#batchid#', batchid);
            sql = sql.replace('#buildingid#', buildingid);
          }
          console.log(sql);
          return this.db.executeSql(sql, []);
        }).then((v: any) => {
          let data: Array<any>; data = [];
          for (let j = 0; j < v.rows.length; j++) {
            console.log(JSON.stringify(v.rows.item(j)));
            data.push(v.rows.item(j));
          }
          if (v.rows.length > 0) {
            console.log(data);
            jsonarr.push({ TableName: tablename, data: data });
          }
          console.log("jsonarr:" + jsonarr.length);
          return jsonarr;
        })
      }
      resolve(tmppromise);
    })
  }

  resetuploaddata(projid, batchid, buildingid, tablenames: Array<string>): Promise<any> {
    return new Promise((resolve) => {
      var jsonarr: Array<any>; jsonarr = [];
      let tmppromise = Promise.resolve([]);
      for (var i = 0; i < tablenames.length; i++) {
        let tablename = tablenames[i];
        console.log('reset up'+tablename);
        tmppromise = tmppromise.then(() => {
          let sql = "delete from #tablename# where projid = '#projid#' and batchid = '#batchid#' and buildingid = '#buildingid#' and versionid = 0";
          sql = sql.replace('#tablename#', tablename)
          sql = sql.replace('#projid#', projid);
          sql = sql.replace('#batchid#', batchid);
          sql = sql.replace('#buildingid#', buildingid);
          return this.db.executeSql(sql, []);
        }).then((v) => {
          if (tablename == "FormalCheckIssues") {
            let sql = "delete from upl#tablename# where projid = '#projid#' and batchid = '#batchid#' and buildingid = '#buildingid#'";
            sql = sql.replace('#tablename#', tablename)
            sql = sql.replace('#projid#', projid);
            sql = sql.replace('#batchid#', batchid);
            sql = sql.replace('#buildingid#', buildingid);
            return this.db.executeSql(sql, []);
          } else {
            return 1;
          }
        })
      }
      resolve(tmppromise);
    })

  }



  uploadbuildinginfo(token, projid, batchid, buildingid, type): Promise<any> {
    return new Promise((resolve) => {
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      console.log("uploadbuildinginfo");
      resolve(promise.then((v) => {
        let sql = "select upl.fn,it.src from uplimagetable upl inner join imagetable it on it.fn = upl.fn and it.projid = upl.projid  where upl.projid = '#projid#' and upl.batchid = '#batchid#' and upl.buildingid = '#buildingid#'";
        sql = sql.replace('#projid#', projid).replace('#batchid#', batchid).replace('#buildingid#', buildingid);
        console.log(sql);
        return this.db.executeSql(sql, []);
      }).then((val: any) => {
        let tmppromise = Promise.resolve(10);
        for (var i = 0; i < val.rows.length; i++) {
          console.log(JSON.stringify(val.rows.item(i)))
          let filename = val.rows.item(i).fn;
          let src = val.rows.item(i).src;
          tmppromise = tmppromise.then(() => {
            return this.uploadimg(src, filename);
          }).then((v) => {
            return 1;
          })
        }
        return tmppromise;
      }).then((v1) => {
        return this.uploaddata(projid, batchid, buildingid, ["FormalCheckIssues", "RoomNoAcceptLogs", "FormalRoomDetails", "CustRoomSatisfactions"]);
      }).then((v2) => {
        console.log("v2:" + v2);
        console.log("v2:" + JSON.stringify(v2));
        return this.httpService.post(APP_SERVE_URL + "/DynamicsPack", { Token: token, ProjId: projid, BatchId: batchid, BuildingId: buildingid, JsonStr: JSON.stringify(v2) });
      }).then((v3) => {
        console.log("v3");
        return this.resetuploaddata(projid, batchid, buildingid, ["FormalCheckIssues", "RoomNoAcceptLogs", "FormalRoomDetails", "CustRoomSatisfactions"]);
      }).then((v4) => {
        console.log('v4');
        let sql = "delete from uplimagetable where projid = '#projid#' and batchid = '#batchid#' and buildingid = '#buildingid#'";
        sql = sql.replace('#projid#', projid).replace('#batchid#', batchid).replace('#buildingid#', buildingid);
        console.log(sql);
        return this.db.executeSql(sql, []);
      }).then((v5) => {
        let sql = "update buildingversion set needupload = 0 where projid = '#projid#' and batchid = '#batchid#' and buildingid = '#buildingid#' and type = #type#";
        sql = sql.replace('#projid#', projid);
        sql = sql.replace('#batchid#', batchid);
        sql = sql.replace('#buildingid#', buildingid);
        sql = sql.replace('#type#', type);
        console.log('updbvdata:' + sql);
        return this.db.executeSql(sql, []);
      }).then((v6) => {
        console.log('v6')
        return this.updatebuildinginfo(token, projid, batchid, buildingid, type);
      }).catch(err => {
        console.log("楼栋上传失败:" + err);
      }))
    })
  }

  updatebuildinginfo(token, projid, batchid, buildingid, type): Promise<any> {
    return new Promise((resolve) => {
      console.log('update bu info:' + projid);
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      resolve(promise.then((v1) => {
        let sql = "select VersionId from buildingversion where projid = '#projid#' and batchid = '#batchid#' and buildingid = '#buildingid#' and type = #type#";
        sql = sql.replace('#projid#', projid);
        sql = sql.replace('#batchid#', batchid);
        sql = sql.replace('#buildingid#', buildingid);
        sql = sql.replace('#type#', type);
        console.log(sql);
        return this.db.executeSql(sql, []);
      }).then((v2: any) => {
        console.log(v2);
        console.log(JSON.stringify(v2.rows.item(0)));
        console.log(v2.rows.item(0).VersionId);
        let versionid: number;
        versionid = v2.rows.item(0).VersionId;
        return this.httpService.get(APP_SERVE_URL + "/DynamicsPack", { Token: token, projId: projid, Batchid: batchid, buildingid: buildingid, batchVersion: versionid, type: type });
      }).then((v3) => {
        console.log("v3");
        return this.updateDynamicsPack(v3[0], projid, batchid, buildingid, type);
      }).catch(err => {
        return console.log("楼栋更新失败:" + err);
      }))
    })
  }

  updateDynamicsPack(data, projid, batchid, buildingid, type): Promise<any> {
    return new Promise((resolve) => {
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      let tablename: Array<string>;
      tablename = [];
      resolve(promise.then((v1) => {
        let tmppromise = Promise.resolve([]);
        for (var i = 2; i < data.length; i += 2) {
          let items = data[i];
          console.log(items[0]);
          if (data[i + 1].length > 0) {
            let tmptbname = 'tmp' + items[0];
            tablename.push(items[0]);
            let tmpdata: Array<any>; tmpdata = [];
            tmpdata = data[i + 1];
            tmppromise = tmppromise.then(() => {
              return this.resetdata(tmptbname);
            }).then(v => {
              return this.initBaseData(tmptbname, tmpdata);
            })
          }
        }
        return tmppromise;
      }).then((v2: any) => {
        let tablefield: Array<any>; tablefield = [];
        tablefield.push("FormalCheckIssues"); tablefield.push("BatchId,IssueId,RoomId,PositionId,CheckItemId,PlusDesc,IssueDesc,UrgencyId,ImgBefore1,ImgBefore2,ImgBefore3,ImgAfter1,ImgAfter2,ImgAfter3,Id,IssueStatus,VendId,ResponVendId,ProjId,Manager,ResponsibleId,IssueType,RegisterDate ,AppointDate,LimitDate,ReFormDate,CloseDate,CloseReason,CancelDate,CancelReason,VersionId,ImgClose1,ImgClose2,ImgClose3,ReturnDate,ReturnReason,ReturnNum,BuildingId,EngineerId,ReviewDate ,x ,y ,ResponsibleName,ResponsiblePhone,EngineerName,EngineerPhone");
        tablefield.push("CustRoomSatisfactions"); tablefield.push("RoomId,SatisfiedDim,HousingType,Score,ProjId,VersionId,Id,BatchId,Buildingid");
        tablefield.push("RoomNoAcceptLogs"); tablefield.push("ProjId,RoomId,PlusDesc,VersionId,ID,ReasonNoAcceptId,BatchId,Buildingid,UserName,TransDate");
        tablefield.push("FormalRoomDetails"); tablefield.push("RoomId,TransDate,RoomStatus,CustId,CustPhone,Remark,EngineerId,EngineerPhone,ImgSign,ProjId,VersionId,ID,AmmeterNumber,AmmeterReading,WaterMeterNumber,WaterMeterReading,GasMeterNumber,GasMeterReading,KeyRetentionStatus,BatchId,BuildingId,EngineerName");
        let tmppromise = Promise.resolve([]);
        for (var i = 0; i < tablename.length; i++) {
          console.log(tablename[i]);
          let tn = tablename[i];
          tmppromise = tmppromise.then(() => {
            let sql = "delete from #tablename# where exists (select ID from #tmptablename# where #tmptablename#.Id = #tablename#.Id)";
            sql = sql.replace('#tablename#', tn);
            sql = sql.replace('#tablename#', tn);
            sql = sql.replace('#tmptablename#', 'tmp' + tn);
            sql = sql.replace('#tmptablename#', 'tmp' + tn);
            console.log(sql);
            return this.db.executeSql(sql, []);
          }).then(v => {
            let sql = "insert into #tablename#( #fields# ) select #fields# from #tmptablename#";
            sql = sql.replace('#tablename#', tn);
            sql = sql.replace('#tmptablename#', 'tmp' + tn);
            let fieldstr = tablefield[tablefield.indexOf(tn, 0) + 1];
            sql = sql.replace('#fields#', fieldstr);
            sql = sql.replace('#fields#', fieldstr);
            console.log(sql);
            return this.db.executeSql(sql, []);
          })
          /////图片处理  "CustRoomSatisfactions", "RoomId,SatisfiedDim,HousingType,Score integer,ProjId,VersionId integer,Id,BatchId"          
        }
        return tmppromise;
      }).then(v3 => {
        //ImgBefore1,Imgbefore2,ImgBefore3,ImgAfter1,ImgAfter2,ImgAfter3,ImgClose1,ImgClose2,ImgClose3
        let sql = "select imgbefore1 as fn from #tmptablename# where imgbefore1 != '' and imgbefore1 != 'NUll' and not exists (select projid from imagetable where imagetable.projid = '#projid#' and imagetable.fn = #tmptablename#.imgbefore1) ".replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#projid#', projid);
        sql += " union select imgbefore2 as fn from #tmptablename# where imgbefore2 != '' and imgbefore2 != 'NUll' and not exists (select projid from imagetable where imagetable.projid = '#projid#' and imagetable.fn = #tmptablename#.imgbefore2) ".replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#projid#', projid);
        sql += " union select imgbefore3 as fn from #tmptablename# where imgbefore3 != '' and imgbefore3 != 'NUll' and not exists (select projid from imagetable where imagetable.projid = '#projid#' and imagetable.fn = #tmptablename#.imgbefore3) ".replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#projid#', projid);
        sql += " union select ImgAfter1 as fn from #tmptablename# where ImgAfter1 != '' and ImgAfter1 != 'NUll' and not exists (select projid from imagetable where imagetable.projid = '#projid#' and imagetable.fn = #tmptablename#.ImgAfter1) ".replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#projid#', projid);
        sql += " union select ImgAfter2 as fn from #tmptablename# where ImgAfter2 != '' and ImgAfter2 != 'NUll' and not exists (select projid from imagetable where imagetable.projid = '#projid#' and imagetable.fn = #tmptablename#.ImgAfter2) ".replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#projid#', projid);
        sql += " union select ImgAfter3 as fn from #tmptablename# where ImgAfter3 != '' and ImgAfter3 != 'NUll' and not exists (select projid from imagetable where imagetable.projid = '#projid#' and imagetable.fn = #tmptablename#.ImgAfter3) ".replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#projid#', projid);
        sql += " union select ImgClose1 as fn from #tmptablename# where ImgClose1 != '' and ImgClose1 != 'NUll' and not exists (select projid from imagetable where imagetable.projid = '#projid#' and imagetable.fn = #tmptablename#.ImgClose1) ".replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#projid#', projid);
        sql += " union select ImgClose2 as fn from #tmptablename# where ImgClose2 != '' and ImgClose2 != 'NUll' and not exists (select projid from imagetable where imagetable.projid = '#projid#' and imagetable.fn = #tmptablename#.ImgClose2) ".replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#projid#', projid);
        sql += " union select ImgClose3 as fn from #tmptablename# where ImgClose3 != '' and ImgClose3 != 'NUll' and not exists (select projid from imagetable where imagetable.projid = '#projid#' and imagetable.fn = #tmptablename#.ImgClose3) ".replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#tmptablename#', 'tmpFormalCheckIssues').replace('#projid#', projid);
        sql += " union select ImgSign as fn from #tmptablename2# where ImgSign != '' and ImgSign != 'NUll' and not exists (select projid from imagetable where imagetable.projid = '#projid#' and imagetable.fn = #tmptablename2#.ImgSign) ".replace('#tmptablename2#', 'tmpFormalRoomDetails').replace('#tmptablename2#', 'tmpFormalRoomDetails').replace('#projid#', projid);
        console.log(sql);
        return this.db.executeSql(sql, []);
      }).then((v4: any) => {
        console.log("v4:" + v4);
        let tmppromise = Promise.resolve([]);
        for (var j = 0; j < v4.rows.length; j++) {
          console.log(JSON.stringify(v4.rows.item(j)));
          let fn = v4.rows.item(j).fn;
          tmppromise = tmppromise.then(() => {
            return this.downloadimg(fn);
          }).then(val => {
            return this.db.executeSql("insert into imagetable (projid,fn,src) values ('" + projid + "','" + fn + "','" + val + "')", []);
          })
        }
        return tmppromise;
      }).then(v5 => {
        let sql = "update buildingversion set needupd = 0,versionId = #version# where projid = '#projid#' and batchid = '#batchid#' and buildingid = '#buildingid#' and type = #type#";
        sql = sql.replace('#projid#', projid);
        sql = sql.replace('#batchid#', batchid);
        sql = sql.replace('#buildingid#', buildingid);
        sql = sql.replace('#type#', type);
        sql = sql.replace('#version#', data[1][0]);
        console.log('updbvdata:' + sql);
        return this.db.executeSql(sql, []);
      }).catch(err => {
        console.log(err);
      }))
    })
  }

  updateuploadflag(projid, batchid, buildingid, type): Promise<number> {
    return new Promise((resolve) => {
      let sql = "update buildingversion set needupload = 1 where projid = '#projid#' and batchid = '#batchid#' and buildingid = '#buildingid#' and type = #type# and needupload = 0";
      sql = sql.replace('#projid#', projid);
      sql = sql.replace('#batchid#', batchid);
      sql = sql.replace('#buildingid#', buildingid);
      sql = sql.replace('#type#', type);
      console.log(sql);
      resolve(this.db.executeSql(sql, []));
    })
  }

  existstable(tablename): Promise<number> {
    return new Promise((resolve) => {
      let sql = "select count(*) as counts from sqlite_master where name=" + "'" + tablename + "'";
      this.db.executeSql(sql, []).then(val => {
        resolve(val.rows.item(0).counts);
        console.log('Transaction finished, check record count: ' + tablename + "   " + JSON.stringify(val.rows.item(0)));
      }).catch(err => {
        this.warn(tablename + '加载错误:' + err);
      })
    })
  }

  getProjVersion(): Promise<Array<any>> {
    return new Promise((resolve) => {
      let projlist: Array<any>;
      projlist = [];
      this.db.executeSql("SELECT Projid,ProjName,VersionId,needupd FROM ProjVersion", []).then(vres => {
        for (var i = 0; i < vres.rows.length; i++) {
          console.log(JSON.stringify(vres.rows.item(i)));
          projlist.push({ projid: vres.rows.item(i).Projid, projname: vres.rows.item(i).ProjName, version: vres.rows.item(i).VersionId, needupd: vres.rows.item(i).Needupd });
        }
        console.log(projlist);
        resolve(projlist);
      }).catch(err => {
        this.warn('项目加载错误:' + err);
      })
    })
  }

  getbatch(projid, type, token): Promise<Array<any>> {
    return new Promise((resolve) => {
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      resolve(promise.then((v1) => {
        return this.initbuildingversion(token, projid);
      }).then((v1) => {
        let sql: string;
        sql = "SELECT batchname,batchid FROM buildingversion where projid = '#projid#' and type = #type# group by batchname,batchid";// 
        sql = sql.replace("#projid#", projid);
        sql = sql.replace("#type#", type);
        console.log(sql);
        return this.db.executeSql(sql, []);
      }).then((batchlist: any) => {
        console.log(JSON.stringify(batchlist.rows.item(0)));
        let batchbuildings: Array<any>; batchbuildings = [];
        let tmppromise = Promise.resolve([]);
        for (var i = 0; i < batchlist.rows.length; i++) {
          console.log(batchlist.rows.item(i).BatchName);
          let batchid = batchlist.rows.item(i).Batchid;
          let batchname = batchlist.rows.item(i).BatchName;
          tmppromise = tmppromise.then(() => {
            return this.getBuilding(projid, batchid, type);
          }).then(val => {
            console.log('val' + val);
            console.log(batchid);
            batchbuildings.push({ batchid: batchid, batchname: batchname, buildings: val });
            return batchbuildings;
          })
        }
        return tmppromise;
      }).then((buildinglist: Array<any>) => {
        console.log(buildinglist);
        return buildinglist;
      }).catch(err => {
        this.warn('批次加载错误:' + err);
      }))
    })
  }

  getBuilding(projid, batchid, type): Promise<Array<any>> {
    return new Promise((resolve) => {
      let sql: string;
      sql = "SELECT buildingid,buildingname,needupd,needdownload,needupload FROM buildingversion where projid = '#projid#' and type = #type# and batchid = '#batchid#' order by buildingid";
      sql = sql.replace("#projid#", projid);
      sql = sql.replace("#type#", type);
      sql = sql.replace("#batchid#", batchid);
      //var buildinglist: Array<any>;
      //buildinglist = [];     
      console.log(sql);
      this.db.executeSql(sql, []).then(list => {
        console.log(JSON.stringify(list.rows.item(0)));
        //for (var i = 0; i < vres.rows.length; i++) {
        //buildinglist.push({ projid: vres.rows.item(i).Projid, projname: vres.rows.item(i).ProjName, version: vres.rows.item(i).VersionId, needupd: vres.rows.item(i).needupd });
        //}
        //resolve(buildinglist);
        let buildings: Array<any>;
        buildings = [];
        let needtype: number;
        for (let i = 0; i < list.rows.length; i++) {  //Buildingid,BuildingName,needupd,needdownload 
          console.log('for');
          if (list.rows.item(i).needdownload == 1)
            needtype = 1;
          else if (list.rows.item(i).needupload == 1)                    /////////////////上传标记判断
            needtype = 2;
          else if (list.rows.item(i).needupd == 1)
            needtype = 3;
          else
            needtype = 0;
          console.log("needtype:" + needtype);
          buildings.push({ buildingid: list.rows.item(i).Buildingid, buildingname: list.rows.item(i).BuildingName, needtype: needtype });
        }
        console.log(buildings);
        resolve(buildings);

      }).catch(err => {
        this.warn('楼栋加载错误:' + err);
      })
    })
  }

  getfloors(projid, batchid, buildingid, type): Promise<Array<any>> {
    return new Promise((resolve) => {
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      resolve(promise.then((v1) => {
        // let sql = "select floorid,sortcode from rooms inner join formalcheckbatchrooms fcr on fcr.roomid = rooms.id and fcr.projid = '#projid#' and fcr.batchid = '#batchid#' and fcr.buildingid = '#buildingid#' group by sortcode,floorid order by sortcode";
        let sql = "select * from rooms "
          //+ "left outer join (select roomid,count(*) as dpd from formalcheckissues fci1 where fci1.issuestatus = '待派单' group by roomid) fdpd on fdpd.roomid = rooms.id"
          + "left outer join (select roomid, count(*) as dzg from formalcheckissues fci2 where fci2.issuestatus = '待整改' or fci2.issuestatus = '待派单' group by roomid) fdzg on fdzg.roomid = rooms.id "
          + "left outer join (select roomid, count(*) as yzg from formalcheckissues fci3 where fci3.issuestatus = '已整改' group by roomid) fyzg on fyzg.roomid = rooms.id "
          + "left outer join (select roomid, count(*) as ytg from formalcheckissues fci4 where fci4.issuestatus = '已通过' group by roomid) fytg on fytg.roomid = rooms.id "
          + "where exists (select roomid from formalcheckbatchrooms fcr where fcr.roomid = rooms.id and fcr.projid = '#projid#' and fcr.batchid = '#batchid#' and fcr.buildingid = '#buildingid#')"
          + "order by rooms.sortcode, rooms.unit";
        sql = sql.replace('#projid#', projid);
        sql = sql.replace('#batchid#', batchid);
        sql = sql.replace('#buildingid#', buildingid);
        console.log(sql);
        return this.db.executeSql(sql, []);
      }).then((floorlist: any) => {
        console.log(floorlist);
        let tmppromise = Promise.resolve([]);
        let floorready: any;
        let floorforfix: any;
        let floorfixed: any;
        let floorpass: any;
        let floorall: any;
        floorall = [];
        floorready = [];
        floorforfix = [];
        floorfixed = [];
        floorpass = [];
        let oldfloorid: string; oldfloorid = '';
        let ready: any; let readycounts: number; readycounts = 0;
        let forfix: any; let forfixcounts: number; forfixcounts = 0;
        let fixed: any; let fixedcounts: number; fixedcounts = 0;
        let pass: any; let passcounts: number; passcounts = 0;
        let all: any; let allcounts: number; allcounts = 0;

        for (var i = 0; i < floorlist.rows.length; i++) {
          console.log(JSON.stringify(floorlist.rows.item(i)));
          let items = floorlist.rows.item(i);
          let floorid = items.FloorId;
          console.log(floorid);
          if (oldfloorid != floorid) {
            if (oldfloorid != '') {
              floorall.push(all);
              floorready.push(ready);
              floorforfix.push(forfix);
              floorfixed.push(fixed);
              floorpass.push(pass);
            }
            oldfloorid = floorid;
            ready = { id: floorid, value: [] };
            forfix = { id: floorid, value: [] };
            fixed = { id: floorid, value: [] };
            pass = { id: floorid, value: [] };
            all = { id: floorid, value: [] };
          }
          let color: string;
          if (items.dzg > 0) {
            forfix.value.push({ roomid: items.Id, name: items.Name });
            color = "danger";
            forfixcounts++;
          }
          else if (items.yzg > 0) {
            fixed.value.push({ roomid: items.Id, name: items.Name });
            color = "primary";
            fixedcounts++;
          }
          else if (items.ytg > 0) {
            pass.value.push({ roomid: items.Id, name: items.Name });
            color = "secondary";
            passcounts++;
          }
          else {
            ready.value.push({ roomid: items.Id, name: items.Name });
            color = "light";
            readycounts++;
          }
          allcounts++;
          all.value.push({ roomid: items.Id, name: items.Name, color: color });
        }
        if (oldfloorid != '') {
          floorall.push(all);
          floorready.push(ready);
          floorforfix.push(forfix);
          floorfixed.push(fixed);
          floorpass.push(pass);
        }
        let res: Array<any>;
        res = [{ counts: allcounts, items: floorall }, { counts: readycounts, items: floorready }, { counts: forfixcounts, items: floorforfix }, { counts: fixedcounts, items: floorfixed }, { counts: passcounts, items: floorpass }];
        return res;
      }).catch(err => {
        console.log("房间加载失败:" + err);
      }))
    })
  }

  getissuelist(projid, batchid, roomid, type): Promise<Array<any>> {
    return new Promise((resolve) => {
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      console.log("issuelist");
      resolve(promise.then((v1) => {
        let tablename: string;
        if (type == 3)
          tablename = "FormalCheckIssues";
        let sql = "select iss.Id,iss.IssueId,iss.IssueStatus,iss.x,iss.y,iss.IssueDesc,iss.PlusDesc,iss.UrgencyId,iss.EngineerName,iss.ResponsibleName,iss.ReturnNum,iss.LimitDate,pp.name as position,pci.name as checkitem from #tablename# as iss inner join projpositions pp on pp.Id = iss.positionid and pp.projid = iss.projid inner join projcheckitems AS pci on pci.id = iss.CheckItemId and pci.projid = iss.projid where iss.projid = '#projid#' and iss.batchid = '#batchid#' and iss.roomid = '#roomid#'";
        sql = sql.replace('#tablename#', tablename);
        sql = sql.replace('#projid#', projid);
        sql = sql.replace('#batchid#', batchid);
        sql = sql.replace('#roomid#', roomid);
        console.log(sql);
        return this.db.executeSql(sql, []);
      }).then((v2: any) => {
        console.log(v2);
        let issuelist: Array<any>; issuelist = [];
        for (var i = 0; i < v2.rows.length; i++) {
          console.log(JSON.stringify(v2.rows.item(i)));
          let now = new Date();
          let dt = new Date(v2.rows.item(i).LimitDate);
          let days = 0;
          if (now < dt) {
            days = dt.getDay() - now.getDay();
          }
          console.log(v2.rows.item(i).ReturnNum);
          issuelist.push({ id: v2.rows.item(i).Id, status: v2.rows.item(i).IssueStatus, position: v2.rows.item(i).position, checkitem: v2.rows.item(i).checkitem, x: v2.rows.item(i).x, y: v2.rows.item(i).y, issueid: v2.rows.item(i).IssueId, IssueDesc: v2.rows.item(i).IssueDesc, PlusDesc: v2.rows.item(i).PlusDesc, UrgencyId: v2.rows.item(i).UrgencyId, EngineerName: v2.rows.item(i).EngineerName, ResponsibleName: v2.rows.item(i).ResponsibleName, duedate: dt.toLocaleDateString(), overdays: days, returntimes: v2.rows.item(i).ReturnNum });
        }
        console.log(issuelist);
        return issuelist;
      }).catch(err => {
        this.warn('问题加载失败:' + err);
      }))
    })
  }

  getdrawinfo(projid, roomid): Promise<Array<any>> {
    return new Promise((resolve) => {
      let promise = new Promise((resolve) => {
        resolve(10);
      });
      let areas: Array<any>; areas = [];
      resolve(promise.then((v1: any) => {
        console.log(v1);
        let sql = "select apl.positionid,pp.name,apd.x,apd.y from apartmentpostiondraws apd inner join apartmentpostionlink apl on apl.id = apd.Apartmentpostionlinkid inner join projpositions pp on pp.Id = apl.positionid inner join rooms on rooms.apartmentid = apl.apartmentid and rooms.id = '#roomid#' order by apl.positionid";
        sql = sql.replace('#roomid#', roomid);
        console.log(sql);
        return this.db.executeSql(sql, []);
      }).then((v2: any) => {
        console.log(v2);
        let points: Array<any>; points = [];
        let posiold: string; let posi: string; posiold = '';
        let name;
        for (var i = 0; i < v2.rows.length; i++) {
          console.log(JSON.stringify(v2.rows.item(i)));
          posi = v2.rows.item(i).Positionid;
          console.log("posiold:" + posiold);
          console.log("posi:" + posi);
          if (posiold != posi) {
            console.log("posiold != posi:" + posiold);
            if (posiold != '') {
              areas.push({ positionid: posiold, name: name, points: points });
            }
            points = []; posiold = v2.rows.item(i).Positionid;
          }
          points.push({ x: v2.rows.item(i).X, y: v2.rows.item(i).Y });
          name = v2.rows.item(i).Name;
        }
        if (posiold != '') {
          areas.push({ positionid: posiold, name: name, points: points });
        }
        let sql = "select it.src,apt.imgwidth from imagetable it inner join apartments apt on apt.image = it.fn inner join rooms on rooms.apartmentid = apt.Id and rooms.id = '#roomid#'  ";
        sql = sql.replace('#roomid#', roomid);
        return this.db.executeSql(sql, []);
      }).then((v3: any) => {
        console.log(areas);
        let drawlist: Array<any>; drawlist = [];
        drawlist.push({ src: v3.rows.item(0).src, width: v3.rows.item(0).ImgWidth, areas: areas });
        return drawlist;
      }).catch(err => {
        this.warn('问题坐标加载失败:' + err);
      }))
    })
  }
  //("projcheckitems", "ProjId,Id,Name")
  //("vend", "Id,NameAlias,Manager,Phone")
  //("projpositions", "Projid,Id,Name")

  getissueinfo(issueid, type): Promise<any> {
    // return new Promise((resolve) => {
    let sql = "select iss.ResponsibleId,iss.versionid,iss.ImgBefore1,iss.ImgBefore2,iss.ImgBefore3,iss.ImgAfter1,iss.ImgAfter2,iss.ImgAfter3,iss.IssueStatus,iss.ReFormDate,iss.LimitDate,iss.RegisterDate,iss.UrgencyId,iss.PlusDesc,iss.IssueDesc,posi.name as Position,ve.NameAlias as Vendor,reve.NameAlias as Resunit,pci.name as Checkitem from #tablename# as iss inner join projpositions AS posi on posi.Id = iss.PositionId inner join vend AS ve on ve.id = iss.vendid inner join vend AS reve on reve.id = iss.ResponVendId inner join projcheckitems AS pci on pci.id = iss.CheckItemId where iss.Id = '#issueid#'";
    if (type == 3)
      sql = sql.replace('#tablename#', 'FormalCheckIssues');
    sql = sql.replace('#issueid#', issueid);
    console.log(sql);
    return this.db.executeSql(sql, []).then(v => {
      return v;
    }).catch(err => {
      console.log(err);
      return err;
    })
    //return this.db.executeSql(sql, []);
    // })
  }

  getroomissueinfo(roomid, type): Promise<any> {
    return new Promise((resolve) => {
      let sql = "select iss.IssueStatus,iss.PlusDesc,iss.IssueDesc,posi.name as Position,pci.name as Checkitem from #tablename# as iss inner join projpositions AS posi on posi.Id = iss.PositionId inner join projcheckitems AS pci on pci.id = iss.CheckItemId where iss.roomId = '#roomid#'";
      if (type == 3)
        sql = sql.replace('#tablename#', 'FormalCheckIssues');
      sql = sql.replace('#roomid#', roomid);
      console.log(sql);
      resolve(this.db.executeSql(sql, []));
    })
  }

  //("positioncheckitemlink", "Projid,Positionid,Checkitemid")
  //("projcheckitems", "ProjId,Id,Name")
  //("projcheckitemdetails", "ProjId,Checkitemid,Name,Timelimit integer,Sortcode integer")

  getcheckitem(projid, roomid, positionid): Promise<any> {
    return new Promise((resolve) => {
      let sql = "select pji.name,pji.Id from projcheckitems AS pji inner join positioncheckitemlink AS pcil on pji.id = pcil.checkitemid and pji.projid = pcil.projid and pji.projid = '#projid#' and pcil.positionid = '#positionid#'";
      sql = sql.replace('#projid#', projid);
      sql = sql.replace('#positionid#', positionid);
      console.log(sql);
      resolve(this.db.executeSql(sql, []).then((val: any) => {
        console.log('chek:' + val);
        let checkitem: Array<any>; checkitem = [];
        for (let i = 0; i < val.rows.length; i++) {
          console.log(JSON.stringify(val.rows.item(i)));
          checkitem.push({ id: val.rows.item(i).Id, name: val.rows.item(i).Name });
        }
        return checkitem;
      }).catch(err => {
        this.warn('检查项加载失败:' + err);
        throw '检查项加载失败';
      }))

    })
  }

  getcheckitemdescvend(projid, roomid, checkitemid): Promise<any> {
    return new Promise((resolve) => {
      let itemdesc: Array<string>; itemdesc = [];
      let vendlist: Array<any>; vendlist = [];
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      resolve(promise.then((v1) => {
        let sql = "select name from projcheckitemdetails where projid ='" + projid + "' and checkitemid = '#checkitemid#'";
        sql = sql.replace('#checkitemid#', checkitemid);
        console.log(sql);
        return this.db.executeSql(sql, []);
      }).then((v2: any) => {
        console.log('chekitem:' + v2);
        for (let k = 0; k < v2.rows.length; k++) {
          console.log(JSON.stringify(v2.rows.item(k)));
          itemdesc.push(v2.rows.item(k).Name);
        }
        let sql = "select Id,NameAlias,Manager from vend where exists (select vendid from vendprojcheckscopes vpc where vpc.vendid = vend.id and vpc.roomid = '#roomid#' and vpc.ProjCheckItemId = '#checkitemid#') order by NameAlias";
        sql = sql.replace('#roomid#', roomid);
        sql = sql.replace('#checkitemid#', checkitemid);
        console.log(sql);
        return this.db.executeSql(sql, []);
      }).then((v3: any) => {
        let tmpvend: Array<any>; tmpvend = [];
        for (let l = 0; l < v3.rows.length; l++) {
          console.log(JSON.stringify(v3.rows.item(l)));
          vendlist.push({ id: v3.rows.item(l).Id, name: v3.rows.item(l).NameAlias, manager: v3.rows.item(l).Manager });
        }
        console.log(itemdesc);
        console.log(vendlist);
        return [itemdesc, vendlist];
      }).catch(err => {
        this.warn('问题描述加载失败:' + err);
        throw '问题描述加载失败';
      }))
    })
  }

  getroomdetails(roomid, batchid): Promise<any> {
    return new Promise((resolve) => {
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      let sql = "select * from FormalRoomDetails where roomid = '#roomid#' and batchid = '#batchid#'";
      sql = sql.replace('#roomid#', roomid).replace("#batchid#", batchid);
      resolve(promise.then((v1) => {
        return this.db.executeSql(sql, []);
      }).catch(err => {
        this.warn('房间加载失败:' + err);
      }))
    })

  }

  getCustSatisfactions(roomid): Promise<any> {
    return new Promise((resolve) => {
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      resolve(promise.then((v1) => {
        let sql = "select crs.SatisfiedDim as Dim, crs.Score from CustRoomSatisfactions crs inner join custsatisfaction csf on crs.SatisfiedDim = csf.name where crs.roomid = '#roomid#' order by csf.sortcode";
        sql = sql.replace('#roomid#', roomid);
        console.log(sql);
        return this.db.executeSql(sql, []);
      }).then((v2: any) => {
        console.log('v2:' + v2);
        if (v2 && v2.rows.length > 0) {
          return v2;
        } else {
          let sql = "select name as Dim, 0 as Score from custsatisfaction order by sortcode";
          console.log(sql);
          return this.db.executeSql(sql, []);
        }
      }).catch(err => {
        this.warn('客户满意度加载失败:' + err);
      }))
    })
  }
  //("vendprojcheckscopes", "Vendid,Projid,Checkitemid,Roomid,buildingid")
  //("vend", "Id,NameAlias,Manager,Phone")

  // getvendors(roomid, checkitems: Array<any>): Promise<any> {
  //   return new Promise((resolve) => {
  //     let promise = new Promise((resolve) => {
  //       resolve(100);
  //     });
  //     let sql = "select Id,NameAlias,Manager,Phone,checkitemid from vend inner join vendprojcheckscopes vpc on vpc.vendid = vend.id and vpc.roomid = '#roomid#' order by Id";
  //     sql = sql.replace('#roomid#', roomid);      
  //     resolve(promise.then((v1) => {
  //       return this.db.executeSql(sql, []);
  //     }).catch(err => {
  //       this.warn('图片下载失败:' + err);
  //     }))
  //   })

  // }

  getissuetablename(type): string {
    if (type == 3) {
      return 'FormalCheckIssues';
    }
  }

  getuplissuetablename(type): string {
    if (type == 3) {
      return 'uplFormalCheckIssues';
    }
  }

  getstatuscolor(status): string {
    let promise = new Promise((resolve) => {
      resolve(100);
    });
    let sc = ['待派单', 'darkviolet', '待整改', 'red', '已整改', 'blue', '已通过', 'green', '已作废', 'gray', '非正常关闭', 'yellow'];
    return sc[sc.indexOf(status, 0) + 1];
  }

  warn(info): void {
    console.log('%cNativeService/' + info, 'color:#e8c406');
  }

  updateIssue(sqls: Array<string>): Promise<any> {
    return new Promise((resolve) => {
      resolve(this.db.sqlBatch(sqls));
    })
  }

  updateImgData(projid, batchid, buildingid, images, ext = 'jpeg'): Promise<any> {
    return new Promise((resolve) => {
      let imgfn = [];
      let sqls = [];
      images.forEach((val: string) => {
        if (val) {
          let tmpstr = 'data:image/' + ext + ';base64,';
          val = val.replace(tmpstr, '');
          let filename = Md5.hashStr(val).toString() + '.' + ext;//'11.jpg';//			
          let sql = " insert into imagetable (projid,fn,src) values('" + projid + "','" + filename + "','" + val + "'); ";
          sqls.push(sql);
          sql = " insert into uplimagetable (projid,batchid,buildingid,fn) values ('" + projid + "','" + batchid + "','" + buildingid + "','" + filename + "'); ";
          sqls.push(sql);
          imgfn.push(filename);
        }
      })
      console.log(sqls);
      this.db.sqlBatch(sqls).then(v => {
        resolve(imgfn);
      }).catch(err => {
        this.warn('图片提交失败:' + err);
        throw '图片提交失败';
      })
    })
  }

  getimagedata(projid, filename): Promise<any> {
    return new Promise((resolve) => {
      let sql = "select src from imagetable where projid = '#projid#' and fn = '#filename#'";
      sql = sql.replace('#filename#', filename);
      sql = sql.replace('#projid#', projid);
      console.log("imagetable:" + sql);
      resolve(this.db.executeSql(sql, []));
    })
  }

  downloadimg(filename): Promise<any> {
    return new Promise((resolve) => {
      console.log('downloading' + filename);
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      resolve(promise.then((v1) => {
        return this.httpService.getimg(FILE_SERVE_URL + "/ydyf_DownLoadFileString", { token: FILE_TOKEN, MD5: filename });
      }).catch(err => {
        this.warn('图片下载失败:' + err);
      }))
    })
  }

  uploadimg(src, filename): Promise<any> {
    return new Promise((resolve) => {
      //let filename = Md5.hashStr(src).toString() + ext;//'11.jpg';//
      console.log(filename);
      //ydyf_DownLoadFile
      this.httpService.postimg(FILE_SERVE_URL + "/ydyf_UpLoadFileString", { token: FILE_TOKEN, FileName: src, MD5: filename }).then(v => {
        resolve(1);
      }).catch(err => {
        this.warn('图片上传失败:' + err);
        resolve(0);
      })
    })
  }

  cleardynamicData(): Promise<any> {
    return new Promise((resolve) => {
      //let filename = Md5.hashStr(src).toString() + ext;//'11.jpg';//
      console.log("clearData");
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      resolve(promise.then((v1) => {
        return this.resetdata("tmpprojversion");
      }).then((v2) => {
        return this.resetdata("uplimagetable");
      }).then((v3) => {
        return this.resetdata("tmpbuildingversion");
      }).then((v5) => {
        return this.resetdata("FormalCheckBatchRooms");
      }).then((v6) => {
        return this.resetdata("Rooms");
      }).then((v1) => {
        return this.resetdata("FormalCheckIssues");
      }).then((v2) => {
        return this.resetdata("tmpFormalCheckIssues");
      }).then((v3) => {
        return this.resetdata("uplFormalCheckIssues");
      }).then((v5) => {
        return this.resetdata("CustRoomSatisfactions");
      }).then((v6) => {
        return this.resetdata("tmpCustRoomSatisfactions");
      }).then((v1) => {
        return this.resetdata("RoomNoAcceptLogs");
      }).then((v2) => {
        return this.resetdata("tmpRoomNoAcceptLogs");
      }).then((v3) => {
        return this.resetdata("FormalRoomDetails");
      }).then((v5) => {
        return this.resetdata("tmpFormalRoomDetails");
      }).then((v6) => {
        console.log('vt6');
        return this.db.executeSql("update buildingversion set needupd = 1, needdownload = 1, versionid = 0",[]);
      }).then((v6) => {
        return this.db.executeSql("delete from imagetable where fn not in (select image from apartments)",[]);
      }).catch(err => {
        console.log(err);
      }))
    })
  }

  testupdate() {      //[["CustRoomStatisfactions"],[{ProjId:'projid1',VersionId:'VersionId1',RoomId:'RoomId1',SatisfiedDim:'SatisfiedDim1',Score:5},{ProjId:'projid2',VersionId:'VersionId2',RoomId:'RoomId2',SatisfiedDim:'SatisfiedDim2',Score:4}]]
    this.db.executeSql("SELECT * FROM FormalCheckIssues", []).then(vres => {   //SELECT count(*) as counts FROM
      var data: Array<any>; data = [];
      console.log(vres);
      console.log(JSON.stringify(vres.rows.item(0)));
      console.log(vres.rows.item(0).RegisterDate);
      let dt = new Date(vres.rows.item(0).RegisterDate);
      console.log(dt);
      console.log(dt.toLocaleDateString());
    })
  }

  testsql(): Promise<any> {
    return new Promise((resolve) => {
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      resolve(promise.then((v) => {  ////////////////////承建商分支判断
        return this.initdb("tttt.db", false);
      }).then((v1) => {
        console.log('v1');
        return this.initBaseTable("imagetable", "projid,fn,src,status integer default 0");
      }).then((v2: any) => {
        console.log('v2');
        return this.initBaseTable("uplimagetable", "Projid,Buildingid,Batchid,fn");
      }).then((v3) => {
        console.log('v3');
        let sql = "insert into imagetable (projid,fn,src) values('6a397ed5-3923-47e4-8f5a-033920062c02','572c5db0bb8ae0f3a004d289e3bc0cc3.jpeg','/9j/4AAQSkZJRgAB')";
        let sql2 = "insert into uplimagetable (projid,batchid,buildingid,fn) values ('6a397ed5-3923-47e4-8f5a-033920062c02','52476447-f177-4633-96d3-045ae45a636c','de9657d4-9c38-46e6-9828-e5cdb86bd4e9','572c5db0bb8ae0f3a004d289e3bc0cc3.jpeg') ";
        return this.db.sqlBatch([sql, sql2]);
        // }).then((v5) => {
        //   console.log('v5');
        //   //let sql = "insert into imagetable (projid,fn,src) values('6a397ed5-3923-47e4-8f5a-033920062c02','572c5db0bb8ae0f3a004d289e3bc0cc3.jpeg','/9j/4AAQSkZJRgAB');";
        //   let sql = "insert into uplimagetable (projid,batchid,buildingid,fn) values ('6a397ed5-3923-47e4-8f5a-033920062c02','52476447-f177-4633-96d3-045ae45a636c','de9657d4-9c38-46e6-9828-e5cdb86bd4e9','572c5db0bb8ae0f3a004d289e3bc0cc3.jpeg'); ";
        //   return this.db.executeSql(sql, []);
      }).then((v4) => {
        console.log('v4');
        let sql = "select upl.fn,it.src from uplimagetable upl inner join imagetable it on it.fn = upl.fn and it.projid = upl.projid  where upl.projid = '6a397ed5-3923-47e4-8f5a-033920062c02' and upl.batchid = '52476447-f177-4633-96d3-045ae45a636c' and upl.buildingid = 'de9657d4-9c38-46e6-9828-e5cdb86bd4e9'";
        return this.db.executeSql(sql, []);
      }).then((v6: any) => {
        console.log('v6');
        for (var i = 0; i < v6.rows.length; i++) {
          console.log(JSON.stringify(v6.rows.item(i)))
        }
        return 11;
      }).catch(err => {
        return console.log("楼栋更新失败:" + err);
      }))
    })
  }

  testhttp() {
    //let v2 = '[{"tablename":"FormalCheckIssues","data":[{"BatchId":"52476447-f177-4633-96d3-045ae45a636c","IssueId":"","RoomId":"282ee31a-83d3-4b02-b4d6-5e2e4b4611e7","PositionId":"2c20fd18-c7f0-402b-9a88-2741e6eef621","CheckItemId":"24fe50a5-bf10-43bc-b662-913ec356494f","PlusDesc":"","IssueDesc":"安装错误","UrgencyId":"一般","ImgBefore1":"7cea66e7b6525e1cc411cac25e805f7f.jpeg","Imgbefore2":null,"ImgBefore3":null,"ImgAfter1":null,"ImgAfter2":null,"ImgAfter3":null,"Id":"14997621218190.1625675274990499","IssueStatus":"待派单","VendId":"6e7ea66c-04fa-4504-b34f-eed42597f6d3","ResponVendId":"6e7ea66c-04fa-4504-b34f-eed42597f6d3","ProjId":"6a397ed5-3923-47e4-8f5a-033920062c02","Manager":null,"ResponsibleId":null,"IssueType":null,"RegisterDate":"2017-07-11 16:35:21","AppointDate":null,"LimitDate":null,"ReFormDate":null,"CloseDate":null,"CloseReason":null,"CancelDate":null,"CancelReason":null,"VersionId":0,"ImgClose1":null,"ImgClose2":null,"ImgClose3":null,"ReturnDate":null,"ReturnReason":null,"ReturnNum":null,"BuildingId":"de9657d4-9c38-46e6-9828-e5cdb86bd4e9","EngineerId":null,"ReviewDate":null,"x":319.0184049079755,"y":326.6871165644172,"ResponsibleName":null,"ResponsiblePhone":null,"EngineerName":"TestAccount","EngineerPhone":"12345678901"}]}]';
    //console.log(JSON.parse(v2));
    //let v = JSON.parse(v2);
    let v2 = '[{"TableName":"FormalCheckIssues","data":[{"BatchId":"52476447-f177-4633-96d3-045ae45a636c","IssueId":"","RoomId":"1c6e9020-bb76-45e3-a01e-b2c4c92a9286","PositionId":"2c20fd18-c7f0-402b-9a88-2741e6eef621","CheckItemId":"f93dbc03-cd72-414a-a6e7-4a9f5871f6f2","PlusDesc":"","IssueDesc":"灯不亮","UrgencyId":"一般","ImgBefore1":"b657931f7ef39593d0ccf052a6ef4238.jpeg","ImgBefore2":"","ImgBefore3":"","ImgAfter1":"","ImgAfter2":"","ImgAfter3":"","Id":"14998411565190.27814669301733375","IssueStatus":"待派单","VendId":"6e7ea66c-04fa-4504-b34f-eed42597f6d3","ResponVendId":"6e7ea66c-04fa-4504-b34f-eed42597f6d3","ProjId":"6a397ed5-3923-47e4-8f5a-033920062c02","Manager":"","ResponsibleId":"","IssueType":"","RegisterDate":"2017-07-12 14:32:36","AppointDate":"1753-01-01 12:00:00","LimitDate":"1753-01-01 12:00:00","ReFormDate":"1753-01-01 12:00:00","CloseDate":"1753-01-01 12:00:00","CloseReason":"","CancelDate":"1753-01-01 12:00:00","CancelReason":null,"VersionId":0,"ImgClose1":"","ImgClose2":"","ImgClose3":"","ReturnDate":"1753-01-01 12:00:00","ReturnReason":"","ReturnNum":0,"BuildingId":"de9657d4-9c38-46e6-9828-e5cdb86bd4e9","EngineerId":"","ReviewDate":"1753-01-01 12:00:00","x":340,"y":376,"ResponsibleName":"","ResponsiblePhone":"","EngineerName":"TestAccount","EngineerPhone":"12345678901"}]}]';
    this.httpService.post(APP_SERVE_URL + "/DynamicsPack", { Token: "051656197F8479E599FD28ADD8126A89", ProjId: "6a397ed5-3923-47e4-8f5a-033920062c02", BatchId: "52476447-f177-4633-96d3-045ae45a636c", BuildingId: "de9657d4-9c38-46e6-9828-e5cdb86bd4e9", JsonStr: v2 });
  }
}
