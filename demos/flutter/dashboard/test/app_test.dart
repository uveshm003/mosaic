import 'package:device_dashboard/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void setSize(WidgetTester tester, Size size) {
  tester.view.physicalSize = size;
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.reset);
}

void main() {
  testWidgets('wide: the overview shows every sensor beside a detail panel', (
    tester,
  ) async {
    setSize(tester, const Size(1400, 900));
    await tester.pumpWidget(const DeviceDashboard(live: false));
    expect(find.text('Sensor A'), findsWidgets);
    expect(find.text('Sensor F'), findsOneWidget);
    expect(find.text('Controls'), findsOneWidget);
  });

  testWidgets('phone: tapping a sensor opens its detail screen', (
    tester,
  ) async {
    setSize(tester, const Size(400, 860));
    await tester.pumpWidget(const DeviceDashboard(live: false));
    expect(find.text('Controls'), findsNothing);
    await tester.tap(find.text('Sensor A'));
    await tester.pumpAndSettle();
    expect(find.text('Controls'), findsOneWidget);
  });

  testWidgets('offline changes queue on the sync screen, then sync', (
    tester,
  ) async {
    setSize(tester, const Size(1400, 900));
    await tester.pumpWidget(const DeviceDashboard(live: false));
    await tester.tap(find.text('Sync'));
    await tester.pumpAndSettle();
    await tester.tap(find.byType(Switch));
    await tester.pumpAndSettle();
    expect(find.text('Offline'), findsOneWidget);

    await tester.tap(find.text('Overview'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('4x'));
    await tester.pump();
    expect(find.textContaining('queued'), findsOneWidget);

    await tester.tap(find.text('Sync').last);
    await tester.pumpAndSettle();
    expect(find.text('Set Sensor A to 4x sampling'), findsOneWidget);
    await tester.tap(find.byType(Switch));
    await tester.pump();
    await tester.tap(find.text('Sync now'));
    await tester.pump(const Duration(milliseconds: 1300));
    await tester.pumpAndSettle();
    expect(find.text('Nothing waiting'), findsOneWidget);
  });
}
