import { Injectable } from '@angular/core';

import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ResponseContentType,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import { provideForRootGuard } from '@angular/router/src/router_module';


@Injectable()  
export class InventoryService {

  constructor(private http: HttpClient) { }
  public proImages: any;
  
  public product(productData: any, productVariants: any,variantColor: any, variantSize: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    
    if(productData.id == 0){
      return this
        .http
        .put<HttpResponse<any>>('/inventory/product', {productData,"variants":productVariants,"variant_color":variantColor, "variant_size":variantSize}, httpOptions).map(resp => {
          const httpResponse: any = resp;
          console.log(httpResponse);
          return httpResponse;
        })
        .catch(productError => {
          return Observable.throw(productError);
        });
    }
    else
    {
      return this.http.post<HttpResponse<any>>('/inventory/product',productData ,httpOptions);
    }
  }


  /// Variants Part Starts ////
  public variants(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
        return this
          .http
          .put<HttpResponse<any>>('/variants/create', params, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(categoryError => {
            return Observable.throw(categoryError);
          });
    
  }

  public listVariantsName(): Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/variants/list_variants_name/', httpOptions);
  }

  
  public variantsValue(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
        return this
          .http
          .put<HttpResponse<any>>('/variants/variants_value_create', params, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(categoryError => {
            return Observable.throw(categoryError);
          });
    
  }


  public listvariants(params: any): Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/variants/variantslist/', params, httpOptions);
  }



  public listvariantsvalue(params: any): Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/variants/variantsvaluelist/', params, httpOptions);
  }


   //getVariants
  public getVariants(): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    
    return this
            .http
            .get<HttpResponse<any>>('/inventory/variants/', httpOptions)
            .map( resp => {

              const httpResponse: any  = resp;
              const variantsLists: any = {};
              
              for(let variant of httpResponse.variants){
                
                  let key : any = variant.type;

                // if(typeof variantsLists[key] === 'undefined') variantsLists[key] = [];

                  const variantData: any =   {
                    id: variant.id,
                    name: variant.value,
                    type: variant.type,
                    short_code: variant.short_code,
                    variant_value_id: variant.variant_value_id,
                    selected: false,
                 };

                 if (typeof variantsLists[variant.type] === 'undefined') {
                  variantsLists[variant.type] = [];
                 }

                 variantsLists[variant.type].push(variantData);
                
               }
               return variantsLists;
             }
         );
      }


      public getCategories(productID:any): Observable<any> {
        const categoryLists: any = [] ;
        const httpParams: HttpParams = new HttpParams().set('product_id', productID);

        return this
                .http
                .get<HttpResponse<any>>('/inventory/categoriesByProduct/', {params:httpParams})
                .map( resp => {
                  console.log('Cat Resp',resp);
                  const httpResponse: any  = resp;
                  for(let category of httpResponse.categories){
                  var fil = httpResponse.sel_categories.filter(function(item) {
                      return (item.id === category.id)?true:false;
                    })[0];
                  console.log('Fil',fil);
                  if(fil)
                    categoryLists.push({name:category.name,id:category.id,selected:true});
                  else
                    categoryLists.push({name:category.name,id:category.id,selected:false});
                 }
                 return categoryLists;
                }
                );
          }

          public getVendorsByProduct(productID:any): Observable<any> {
            const categoryLists: any = [] ;
            const httpParams: HttpParams = new HttpParams().set('product_id', productID);
    
            return this
                    .http
                    .get<HttpResponse<any>>('/inventory/vendorsByProduct/', {params:httpParams})
                    .map( resp => {
                      const httpResponse: any  = resp;
                      return httpResponse.vendors;
              });
            }
    


          public getCategoriesNew(productID:any): Observable<any> {

            const httpParams: HttpParams = new HttpParams().set('product_id', productID);

            return this
                    .http
                    .get<HttpResponse<any>>('/inventory/categories_new/', {params:httpParams})
                    .map( resp => {
                      const httpResponse: any  = resp;
            
                      const categoryLists: any = [] ;
            
                      for(let category of httpResponse.categories){
                        let isAlreadySelected = (category.product_id == productID)?true:false;
                        categoryLists.push({name:category.name,id:category.id,selected:isAlreadySelected});
                      }
    
                       return categoryLists;
                     }
                    );
              }

          public getCategoriesByKey(searchKey): Observable<any> {

            const httpParams: HttpParams = new HttpParams().set('search_key', searchKey);
            
            return this
                    .http
                    .get<HttpResponse<any>>('/inventory/categories_by_key/', {params: httpParams})
                    .map( resp => {

                        const httpResponse: any  = resp;
                        const categoryLists: any = [] ;
              
                        for(let category of httpResponse.categories){
                          categoryLists.push(category.name);
                        }

                        return categoryLists;
                     }
                  );
        }

        public listProducts(params: any): Observable<HttpResponse<any>> {

          const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
          };
      
          return this.http.post<HttpResponse<any>>('/inventory/list/', params, httpOptions);

        }


      public uploadCSV(csv_type:string='',file: any,type:any=''): Observable<HttpResponse<any>>
      {

          console.log(file.name);
          
          const formData: FormData = new FormData();
          formData.append('type',type );
          formData.append('csv_type',csv_type );

          if(type!='confirm'){
            formData.append('fileKey', file, file.name);
          }  
          else if(type=='confirm')
          {
            formData.append('filepath', file);
          }

          console.log(formData);
          const httpOptions = {
            headers: new HttpHeaders({})
          };
      
          return this.http.post<HttpResponse<any>>('/inventory/product_import/', formData, httpOptions);
      }  


      public productImageUploadCSV(): Observable<HttpResponse<any>>
      {

          const formData: FormData = new FormData();

          const httpOptions = {
            headers: new HttpHeaders({})
          };
      
          return this.http.post<HttpResponse<any>>('/inventory/bulk_upload_images_resize/', formData, httpOptions);
      }

      public BulkUpload(file:any ='',productId: any='',variantID: any=''): Observable<HttpResponse<any>>{
        const formData: FormData = new FormData();
        console.log('File',file);
        formData.append('productID',productId);
        formData.append('variantID',variantID);
        formData.append('fileKey', file,file.name); 
        console.log('FormData',formData);
        const httpOptions = {
          headers: new HttpHeaders({})
        };
        return this.http.post<HttpResponse<any>>('/inventory/productImgBulkUpload/', formData, httpOptions);
      }

      public confirmuploadCSV(): Observable<HttpResponse<any>>
      {
         const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
          };
      
        return this.http.post<HttpResponse<any>>('/inventory/confirm_upload/0/product_upload/', '', httpOptions);
      }
   
          
       
        
      //get product by id  
      public getProductDetailsById(id:any,type:string): Observable<HttpResponse<any>> {

        const httpParams: HttpParams = new HttpParams().set('id', id).set('type',type);

      return this
            .http
            .get<HttpResponse<any>>('/inventory/product/', {params: httpParams});
      }

      //update category
      public updateCategoies(productID,categories): Observable<HttpResponse<any>> {

        const httpOptions = {
          headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
    
        return this.http.post<HttpResponse<any>>('/inventory/categories/', {product_id:productID,categories:categories}, httpOptions);
      }


      public getVariantsByProductID(productID): Observable<any> {

        const httpParams: HttpParams = new HttpParams().set('product_id', productID);
        
        return this
                .http
                .get<HttpResponse<any>>('/inventory/variants_by_product_id/', {params: httpParams})
                .map( (resp: any) => {

                    console.log(resp.product_variants);

                    const productVariantsLists: any = [] ;
          
                    for(let variant of resp.product_variants){
                      
                      let productVariantData: any = {
                            productVariantName: variant.product_variant_name,
                            sku: variant.sku,
                            quantity: variant.quantity,
                            price: variant.price,
                            featured:variant.is_featured
                      };

                      productVariantsLists.push(productVariantData);
                    }

                    return productVariantsLists;
                 }
              );
    }

    public addVariantValueToProduct(color:any =[],size:any = [],qty:any,productID,productName): Observable<any> {
      
      const httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      };

      let params: any = {
              color: color,
              size: size,
              qty: qty,
              product_id: productID,
              product_name: productName
      };

      return this
        .http
        .put<HttpResponse<any>>('/inventory/add_new_variant', params, httpOptions).map((resp:any) => {
          return resp;
        })
        .catch(variantError => {
          return Observable.throw(variantError);
        });
  }

  public getColorsByProductID(productID){
    const httpParams: HttpParams = new HttpParams().set('productID', productID);    
    return this
            .http
            .get<HttpResponse<any>>('/inventory/getColorsByProductID/', {params: httpParams})
            .map( (resp: any) => {
              console.log('Res Colors',resp);
              let httpResponse: any = resp.data;
              return httpResponse;
             }
          );
  }
  public updateProductVariantsValue(productVariantData,value,type):Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };


    let params = {
              sku : productVariantData.sku,
              type: type,
              value: value
    };

    return this.http.post<HttpResponse<any>>('/inventory/variants/', params, httpOptions);
}


  public downloadFile(params:any):Observable<any>{
    
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post('/inventory/download_csv',params,httpOptions);
   
  }

  public deleteProduct(params:any){
 
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post('/inventory/deleteProduct',params,httpOptions);

  }

  public getProductImages(productID): Observable<any> {
    console.log('productId',productID);
    const httpParams: HttpParams = new HttpParams().set('productID', productID);    
    return this
            .http
            .get<HttpResponse<any>>('/inventory/getProductImages/', {params: httpParams})
            .map( (resp: any) => {
              console.log('Res',resp);
              let httpResponse: any = resp.data;
              return httpResponse;
             }
          );
  }

  public delImage(params:any){
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post('/inventory/delImages',params,httpOptions);

  }

  public SetFav(params:any){
    console.log('SKY INVENTROY',params);
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post('/inventory/setFav',params,httpOptions);

  }

  //Change status
  public productDisble(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
      .http
      .post<HttpResponse<any>>('/inventory/product_disable', {id:params},httpOptions).map(resp => {
        const httpResponse: any = resp;
        return httpResponse;
      })
      .catch(UpdateError => {
        return Observable.throw(UpdateError);
      });
  }

  //Change status
  public productEnable(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
      .http
      .post<HttpResponse<any>>('/inventory/product_enable', {id:params},httpOptions).map(resp => {
        const httpResponse: any = resp;
        return httpResponse;
      })
      .catch(UpdateError => {
        return Observable.throw(UpdateError);
      });
  }


  public deleteVariantsValue(params:any){
       //console.log(params);
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post('/inventory/variantsValueDelete',{id:params},httpOptions);

  }
  
}


export interface ProductImages{
  name:string;
  size:number;
}