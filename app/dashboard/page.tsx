'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      {/* Page header */}
      <h2 className='text-3xl font-bold'>Dashboard</h2>

      {/* Tabs */}
      <Tabs
        defaultValue='compliance'
        className='w-full'
      >
        <TabsList className='grid w-max grid-cols-2'>
          <TabsTrigger value='compliance'>Compliance</TabsTrigger>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
        </TabsList>

        <TabsContent
          value='compliance'
          className='space-y-6'
        >
          {/* Summary cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Total Active Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>4</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Accepted Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-green-600'>4</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Warnings Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-orange-600'>0</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Rejected Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-red-600'>0</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and analysis */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Sales summary */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Summary</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col justify-center items-center min-h-80'>
                <div className='w-40 h-40 rounded-full border-8 border-green-200 flex items-center justify-center text-2xl font-bold text-green-600'>
                  0%
                </div>
                <p className='text-gray-500 mt-4'>Compliance: 100%</p>
              </CardContent>
            </Card>

            {/* Rejection analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Rejection Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className='border-b'>
                      <TableHead>Error Code</TableHead>
                      <TableHead>Error Description</TableHead>
                      <TableHead>Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className='py-6 text-center text-gray-400'
                      >
                        No rows
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value='overview'
          className='space-y-6'
        >
          {/* Summary cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Total Active Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>4</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Accepted Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-green-600'>4</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Warnings Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-orange-600'>0</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Rejected Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-red-600'>0</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and analysis */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Sales summary */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Summary</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col justify-center items-center min-h-80'>
                <div className='w-40 h-40 rounded-full border-8 border-green-200 flex items-center justify-center text-2xl font-bold text-green-600'>
                  0%
                </div>
                <p className='text-gray-500 mt-4'>Compliance: 100%</p>
              </CardContent>
            </Card>

            {/* Rejection analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Rejection Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className='border-b'>
                      <TableHead>Error Code</TableHead>
                      <TableHead>Error Description</TableHead>
                      <TableHead>Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className='py-6 text-center text-gray-400'
                      >
                        No rows
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
